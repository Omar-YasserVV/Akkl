import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { comparePasswords, hashPassword } from '../../../utils/argon2';
import { PrismaService } from '@app/db';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';
import { LoginDto, CreateUserDto, CompleteGoogleSignupDto } from '@app/common';
import { BlackListService } from '@app/guards/services/blacklist.service';
import { ResetPasswordDto } from '../dtos/auth.dto';
// import { tokenDto } from '@app/common/dtos/UserDto/token.dto';
// TODO: abdo if the tokenDto import is not used delete this line
@Injectable()
export class SvcAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly blackListService: BlackListService,
  ) {}

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  generateToken(payload: { sub: number }) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not set');
    }

    const refreshJwtSecret = process.env.JWT_REFRESH_SECRET;
    if (!refreshJwtSecret) {
      throw new Error('JWT_REFRESH_SECRET not set');
    }

    // jsonwebtoken uses a narrow template-literal type for `expiresIn`.
    // Environment variables are just `string`, so we cast to the expected type.
    const accessExpiresIn = (process.env.JWT_EXPIRATION_TIME ??
      '7h') as jwt.SignOptions['expiresIn'];
    const refreshExpiresIn = (process.env.JWT_EXPIRATION_TIME_REFRESH_TOKEN ??
      '7d') as jwt.SignOptions['expiresIn'];

    const access_token = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: accessExpiresIn,
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: refreshJwtSecret,
      expiresIn: refreshExpiresIn,
    });
    return { access_token, refresh_token };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new RpcException({ message: 'Invalid credentials', status: 401 });
    }

    const isPasswordValid = await comparePasswords(
      data.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new RpcException({ message: 'Invalid credentials', status: 401 });
    }

    const { access_token, refresh_token } = this.generateToken({
      sub: user.id,
    });
    return {
      message: 'Login successful',
      access_token: access_token,
      refresh_token: refresh_token,
      user: { id: user.id, email: user.email },
    };
  }

  async signup(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new RpcException({ message: 'Email already in use', status: 409 });
    }

    const hashedPassword = await hashPassword(data.password);
    const { role, ...userData } = data;

    const newUser = await this.prisma.user.create({
      data: { ...userData, password: hashedPassword, role: role },
    });

    const { access_token, refresh_token } = this.generateToken({
      sub: newUser.id,
    });
    return {
      message: 'Signup successful',
      access_token,
      refresh_token,
      user: { id: newUser.id, email: newUser.email },
    };
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async finalizeGoogleSignup(data: CompleteGoogleSignupDto) {
    const { token, password, passwordConfirmation, phone, role, username } =
      data;

    if (password !== passwordConfirmation) {
      throw new RpcException({
        message: 'Passwords do not match',
        status: 400,
      });
    }

    const tempSecret = process.env.JWT_TEMP_SECRET;
    if (!tempSecret) {
      throw new BadRequestException('JWT_TEMP_SECRET not set');
    }

    const decoded = jwt.verify(token, tempSecret);
    if (
      typeof decoded === 'string' ||
      decoded === null ||
      typeof decoded !== 'object'
    ) {
      throw new BadRequestException('Invalid or expired signup token');
    }

    const tempPayload = decoded as {
      email?: unknown;
      fullName?: unknown;
      image?: unknown;
    };

    if (
      typeof tempPayload.email !== 'string' ||
      typeof tempPayload.fullName !== 'string'
    ) {
      throw new BadRequestException('Invalid or expired signup token');
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await this.prisma.user.create({
      data: {
        email: tempPayload.email,
        password: hashedPassword,
        fullName: tempPayload.fullName,
        phone,
        image:
          typeof tempPayload.image === 'string' ? tempPayload.image : undefined,
        role,
        username,
      },
    });

    const { access_token, refresh_token } = this.generateToken({
      sub: newUser.id,
    });

    return {
      message: 'Signup successful',
      access_token,
      refresh_token,
      user: newUser,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await this.prisma.user.update({
      where: { email },
      data: { otpCode: otp, otpExpires: expires },
    });

    await this.transporter.sendMail({
      to: email,
      subject: 'Your Password Reset OTP',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    return { message: 'OTP sent to email' };
  }

  async verifyOtpAndReset(dto: ResetPasswordDto) {
    const { email, otp, newPassword } = dto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (
      !user ||
      !user.otpCode ||
      !user.otpExpires ||
      user.otpCode !== otp ||
      user.otpExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const hashedPassword = await hashPassword(newPassword);

    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Password reset successful' };
  }
}
