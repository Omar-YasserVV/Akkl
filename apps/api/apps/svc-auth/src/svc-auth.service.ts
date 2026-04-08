import { CompleteGoogleSignupDto, CreateUserDto, LoginDto } from '@app/common';
import { PrismaService } from '@app/db';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { comparePasswords, hashPassword } from '../../../utils/argon2';
import { ResetPasswordDto } from '../dtos/auth.dto';
import { AuthResult, UserResponse } from './interfaces/auth.interface';

interface JwtPayload extends Omit<jwt.JwtPayload, 'sub'> {
  sub: number;
  type?: 'employee' | 'user';
  branchId?: number;
  email?: string;
  fullName?: string;
  image?: string;
}

@Injectable()
export class SvcAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  private generateToken(payload: JwtPayload): {
    access_token: string;
    refresh_token: string;
  } {
    const jwtSecret = process.env.JWT_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtSecret || !refreshSecret) {
      throw new RpcException({
        message: 'JWT configuration missing',
        status: 500,
      });
    }

    const access_token = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: (process.env.JWT_EXPIRATION_TIME ??
        '7h') as jwt.SignOptions['expiresIn'],
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: (process.env.JWT_EXPIRATION_TIME_REFRESH_TOKEN ??
        '7d') as jwt.SignOptions['expiresIn'],
    });

    return { access_token, refresh_token };
  }

  async login(data: LoginDto): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await comparePasswords(data.password, user.password))) {
      throw new RpcException({ message: 'Invalid credentials', status: 401 });
    }

    const tokens = this.generateToken({ sub: user.id });
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        image: user.image ?? undefined, // Fix null -> undefined
      },
    };
  }

  async signup(data: CreateUserDto): Promise<AuthResult> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone: data.phone },
          { username: data.username },
        ],
      },
    });

    if (existingUser) {
      throw new RpcException({
        message: 'User credentials already in use',
        status: 409,
      });
    }

    const hashedPassword = await hashPassword(data.password);
    const newUser = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    const tokens = this.generateToken({ sub: newUser.id });
    return {
      ...tokens,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        username: newUser.username,
        role: newUser.role,
        image: newUser.image ?? undefined, // Explicit mapping
      },
    };
  }

  async finalizeGoogleSignup(
    data: CompleteGoogleSignupDto,
  ): Promise<AuthResult> {
    const { token, password, passwordConfirmation, ...rest } = data;

    if (password !== passwordConfirmation) {
      throw new RpcException({
        message: 'Passwords do not match',
        status: 400,
      });
    }

    const tempSecret = process.env.JWT_TEMP_SECRET;
    if (!tempSecret) throw new BadRequestException('JWT_TEMP_SECRET missing');

    const decoded = jwt.verify(token, tempSecret) as unknown as JwtPayload;

    if (!decoded || typeof decoded === 'string' || !decoded.email) {
      throw new BadRequestException('Invalid signup token');
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await this.prisma.user.create({
      data: {
        email: decoded.email,
        fullName: decoded.fullName ?? '',
        image: decoded.image ?? '',
        password: hashedPassword,
        ...rest,
      },
    });

    const tokens = this.generateToken({ sub: newUser.id });

    // FIX: Map the database object to the restricted UserResponse interface
    return {
      ...tokens,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        image: newUser.image ?? undefined,
      },
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.user.update({
      where: { email },
      data: { otpCode: otp, otpExpires: expires },
    });

    await this.transporter.sendMail({
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is ${otp}. Expires in 10 mins.`,
    });

    return { message: 'OTP sent' };
  }

  async verifyOtpAndReset(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (
      !user ||
      user.otpCode !== dto.otp ||
      (user.otpExpires && user.otpExpires < new Date())
    ) {
      throw new BadRequestException('Invalid/Expired OTP');
    }

    const hashedPassword = await hashPassword(dto.newPassword);
    await this.prisma.user.update({
      where: { email: dto.email },
      data: { password: hashedPassword, otpCode: null, otpExpires: null },
    });

    return { message: 'Success' };
  }

  async createEmployee(data: CreateUserDto): Promise<{
    message: string;
    id: number;
    generatedUsername: string;
    tempPassword: string;
  }> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (existingUser) {
      throw new RpcException({
        message: 'User with this email or phone already exists',
        status: 409,
      });
    }

    const baseUsername = data.fullName.toLowerCase().replace(/\s+/g, '_');
    const randomSuffix = crypto.randomBytes(2).toString('hex');
    const generatedUsername = `${baseUsername}_${randomSuffix}`;

    const tempPassword = crypto.randomBytes(4).toString('hex');
    const hashedPassword = await hashPassword(tempPassword);

    try {
      const newEmployee = await this.prisma.user.create({
        data: {
          ...data,
          username: generatedUsername,
          password: hashedPassword,
          image: data.image ?? null,
        },
      });

      return {
        message:
          'Employee created successfully. Please provide them with their credentials.',
        id: newEmployee.id,
        generatedUsername,
        tempPassword,
      };
    } catch {
      throw new RpcException({
        message: 'Failed to create employee',
        status: 500,
      });
    }
  }

  async getEmployeeProfile(id: number): Promise<UserResponse> {
    const employee = await this.prisma.user.findUnique({
      where: { id },
      include: {
        bransh: {
          select: {
            name: true,
            restaurant: { select: { name: true } },
          },
        },
      },
    });

    if (!employee) {
      throw new RpcException({
        message: 'Employee profile not found',
        status: 404,
      });
    }

    return { ...employee, image: employee.image ?? undefined };
  }
}
