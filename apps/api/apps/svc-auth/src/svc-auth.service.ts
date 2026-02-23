import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords, hashPassword } from '../../../utils/argon2';
import { PrismaService } from '@app/db';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';
import { LoginDto, CreateUserDto, CompleteGoogleSignupDto } from '@app/common';

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

  async generateToken(payload: { sub: number }) {
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION_TIME || ('7h' as any),
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_EXPIRATION_TIME_REFRESH_TOKEN || ('7d' as any),
    });
    return { access_token, refresh_token };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await comparePasswords(
      data.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const { access_token, refresh_token } = await this.generateToken({
      sub: user.id,
    });
    return {
      massage: 'login successful',
      access_token: access_token,
      refresh_token: refresh_token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async signup(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await hashPassword(data.password);

    const { role, ...userData } = data;
    const newuser = await this.prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });
    const { access_token, refresh_token } = await this.generateToken({
      sub: newuser.id,
    });
    return {
      massage: 'login successful',
      access_token: access_token,
      refresh_token: refresh_token,
      user: {
        id: newuser.id,
        email: newuser.email,
      },
    };
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async finalizeGoogleSignup(data: CompleteGoogleSignupDto) {
    const { token, password, passwordConfirmation, phone, role, username } =
      data;

    if (password !== passwordConfirmation) {
      throw new BadRequestException('Passwords do not match');
    }

    const decoded: any = jwt.verify(token, process.env.JWT_TEMP_SECRET!);

    const { access_token, refresh_token } = await this.generateToken({
      sub: decoded.id,
    });
    const hashedPassword = await hashPassword(password);

    const newuser = this.prisma.user.create({
      data: {
        email: decoded.email,
        password: hashedPassword,
        fullName: decoded.fullName,
        phone: phone,
        image: decoded.image,
        role: role,
        username: username,
      },
    });

    return {
      massage: 'sighnup successful',
      access_token: access_token,
      refresh_token: refresh_token,
      user: newuser,
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

  async verifyOtpAndReset(dto: any) {
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
