import {
  AUTH_TOPICS,
  CompleteGoogleSignupDto,
  CreateStaffUserDto,
  LoginDto,
  SignupUserDto,
} from '@app/common';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import { ResetPasswordDto } from 'apps/svc-auth/dtos/auth.dto';
import { UserResponse } from 'apps/svc-auth/src/interfaces/auth.interface';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string; // changed from number to string
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
interface AuthenticatedRequest extends Request {
  user: {
    sub: string; // changed from number to string
    type?: 'employee' | 'user';
    branchId?: string; // changed from number to string
    id: string; // changed from number to string
    email: string;
    fullName?: string;
    username?: string;
    role?: string;
    image?: string;
  };
}

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  async onModuleInit() {
    Object.values(AUTH_TOPICS).forEach((topic) =>
      this.authClient.subscribeToResponseOf(topic),
    );

    await this.authClient.connect();
  }

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
      maxAge: 1000 * 60 * 60 * 7,
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      ...this.cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }

  @Post('signup')
  async signup(
    @Body() data: SignupUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await lastValueFrom(
      this.authClient.send<AuthResponse>('signup', data),
    );

    const { access_token, refresh_token, user } = result;

    this.setAuthCookies(res, { access_token, refresh_token });

    return res.status(HttpStatus.CREATED).json({
      data: { user },
    });
  }

  @Post('login')
  async login(@Body() data: LoginDto, @Res() res: Response): Promise<Response> {
    const result = await lastValueFrom(
      this.authClient.send<AuthResponse>('login', data),
    );
    const { access_token, refresh_token, user } = result;

    this.setAuthCookies(res, { access_token, refresh_token });

    return res.status(HttpStatus.OK).json({
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
        this.authClient.send('logout', { Token: refreshToken }),
      );
    }

    res.clearCookie('access_token', this.cookieOptions);
    res.clearCookie('refresh_token', this.cookieOptions);

    return res.status(HttpStatus.OK).json({
      message: 'Logged out successfully',
    });
  }

  @Post('complete-google-signup')
  async completeGoogleSignup(
    @Body() data: CompleteGoogleSignupDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await lastValueFrom(
      this.authClient.send<AuthResponse>(
        AUTH_TOPICS.COMPLETE_GOOGLE_SIGNUP,
        data,
      ),
    );
    const { access_token, refresh_token, user } = result;

    this.setAuthCookies(res, { access_token, refresh_token });

    return res.status(HttpStatus.OK).json({
      data: { user },
    });
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body('email') email: string,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await lastValueFrom(
      this.authClient.send<MessageResponse>(AUTH_TOPICS.FORGOT_PASSWORD, email),
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetDto: ResetPasswordDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await lastValueFrom(
      this.authClient.send<MessageResponse>(
        AUTH_TOPICS.RESET_PASSWORD,
        resetDto,
      ),
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('staff/create')
  async createStaff(
    @Body() data: CreateStaffUserDto,
  ): Promise<MessageResponse> {
    return await lastValueFrom(
      this.authClient.send<MessageResponse>(AUTH_TOPICS.CREATE_EMPLOYEE, data),
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get authenticated profile' })
  async getEmployeeMe(@Req() req: AuthenticatedRequest): Promise<UserResponse> {
    const userId = req.user.sub || req.user.id;

    if (!userId) {
      throw new HttpException('User ID not found', HttpStatus.UNAUTHORIZED);
    }

    const profile = await lastValueFrom(
      this.authClient.send<UserResponse>(AUTH_TOPICS.GET_USER_PROFILE, userId),
    );

    return profile;
  }
}
