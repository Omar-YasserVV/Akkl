import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords, hashPassword } from '../../../utils/argon2';
import { PrismaService } from '@app/db';
import { LoginDto } from '@app/common';
import { CreateUserDto } from '@app/common';

@Injectable()
export class SvcAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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
}
