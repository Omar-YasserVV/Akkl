import { CompleteGoogleSignupDto, CreateUserDto, LoginDto } from '@app/common';
import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ResetPasswordDto } from 'apps/svc-auth/dtos/auth.dto';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';

// Senior-level approach: Define specific interfaces for Microservice responses
interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    fullName?: string;
    username?: string;
    role?: string;
    image?: string;
  };
}

interface MessageResponse {
  message: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  private readonly cookieOptions = {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };

  private setAuthCookies(
    res: Response,
    tokens: { access_token: string; refresh_token: string },
  ): void {
    res.cookie('access_token', tokens.access_token, {
      ...this.cookieOptions,
      maxAge: 1000 * 60 * 60 * 7, // 7 Hours
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      ...this.cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days
    });
  }

  @Post('signup')
  async signup(
    @Body() data: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    // Specify the return type in .send<T> to avoid 'any' assignment
    const result = await lastValueFrom(
      this.authService.send<AuthResponse>('signup', data),
    );
    const { access_token, refresh_token, user } = result;

    this.setAuthCookies(res, { access_token, refresh_token });

    return res.status(HttpStatus.CREATED).json({
      status: 'success',
      data: { user },
    });
  }

  @Post('login')
  async login(@Body() data: LoginDto, @Res() res: Response): Promise<Response> {
    const result = await lastValueFrom(
      this.authService.send<AuthResponse>('login', data),
    );
    const { access_token, refresh_token, user } = result;

    this.setAuthCookies(res, { access_token, refresh_token });

    return res.status(HttpStatus.OK).json({
      status: 'success',
      data: { user },
    });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const refreshToken = (req.cookies as Record<string, string | undefined>)?.[
      'refresh_token'
    ];

    if (refreshToken) {
      await lastValueFrom(
        this.authService.send('logout', { Token: refreshToken }),
      );
    }

    res.clearCookie('access_token', this.cookieOptions);
    res.clearCookie('refresh_token', this.cookieOptions);

    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  }

  @Post('complete-google-signup')
  async completeGoogleSignup(
    @Body() data: CompleteGoogleSignupDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await lastValueFrom(
      this.authService.send<AuthResponse>('complete-google-signup', data),
    );
    const { access_token, refresh_token, user } = result;

    this.setAuthCookies(res, { access_token, refresh_token });

    return res.status(HttpStatus.OK).json({
      status: 'success',
      data: { user },
    });
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body('email') email: string,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await lastValueFrom(
      this.authService.send<MessageResponse>('forgot-password', email),
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetDto: ResetPasswordDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await lastValueFrom(
      this.authService.send<MessageResponse>('reset-password', resetDto),
    );
    return res.status(HttpStatus.OK).json(result);
  }
}
