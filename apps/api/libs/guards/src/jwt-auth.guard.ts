import { PrismaService } from '@app/db';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { BlackListService } from './services/blacklist.service';

/**
 * Using 'type' instead of 'interface' to satisfy JwtService's internal Record types
 */
type JwtUserPayload = {
  sub: string;
  role?: string;
  type?: string;
};

/**
 * Define the user object structure that will be attached to the request
 */
type RequestUser = JwtUserPayload & { branchId: string | null };

/**
 * Extend Express Request with specific cookie and user types
 */
interface AuthenticatedRequest extends Request {
  cookies: Record<string, string | undefined>;
  user?: RequestUser;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly blacklistService: BlackListService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();

    // 1. Explicitly type the request to avoid 'any' assignment
    const request = httpContext.getRequest<AuthenticatedRequest>();
    const response = httpContext.getResponse<Response>();

    const accessToken = request.cookies['access_token'];
    const refreshToken = request.cookies['refresh_token'];

    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException('No authentication token found');
    }

    if (refreshToken) {
      const isInvalid =
        await this.blacklistService.isTokenBlacklisted(refreshToken);
      if (isInvalid) {
        this.clearCookies(response);
        throw new UnauthorizedException('Token is blacklisted');
      }
    }

    // Handle missing access token via refresh
    if (!accessToken && refreshToken) {
      return this.handleRefreshToken(request, response, refreshToken);
    }

    try {
      // 2. Use non-null assertion (!) only if you've already checked for existence
      const decoded = await this.jwtService.verifyAsync<JwtUserPayload>(
        accessToken as string,
        {
          secret: String(process.env['JWT_SECRET'] ?? ''),
        },
      );

      const dbUser = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
        select: { branchId: true },
      });

      request.user = {
        ...decoded,
        branchId: dbUser?.branchId ?? null,
      };

      return true;
    } catch (error: unknown) {
      const err = error as { name?: string };
      if (err.name === 'TokenExpiredError' && refreshToken) {
        return this.handleRefreshToken(request, response, refreshToken);
      }
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private async handleRefreshToken(
    req: AuthenticatedRequest,
    res: Response,
    refreshToken: string,
  ): Promise<boolean> {
    try {
      const decodedRefresh = await this.jwtService.verifyAsync<JwtUserPayload>(
        refreshToken,
        {
          secret: String(process.env['JWT_REFRESH_SECRET'] ?? ''),
        },
      );

      const payload: JwtUserPayload = {
        sub: decodedRefresh.sub,
        role: decodedRefresh.role,
        type: decodedRefresh.type,
      };

      // 3. Cast 'expiresIn' to 'any' inside a strictly typed object to satisfy the JWT Overload
      const accessOptions: JwtSignOptions = {
        secret: String(process.env['JWT_SECRET'] ?? ''),
        expiresIn: (process.env['JWT_EXPIRATION_TIME'] ?? '7h') as any,
      };

      const refreshOptions: JwtSignOptions = {
        secret: String(process.env['JWT_REFRESH_SECRET'] ?? ''),
        expiresIn: (process.env['JWT_EXPIRATION_TIME_REFRESH_TOKEN'] ??
          '7d') as any,
      };

      const newAccessToken = await this.jwtService.signAsync(
        payload,
        accessOptions,
      );
      const newRefreshToken = await this.jwtService.signAsync(
        payload,
        refreshOptions,
      );

      this.setCookies(res, newAccessToken, newRefreshToken);

      const dbUser = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { branchId: true },
      });

      req.user = {
        ...payload,
        branchId: dbUser?.branchId ?? null,
      };

      return true;
    } catch {
      this.clearCookies(res);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private setCookies(res: Response, access: string, refresh: string): void {
    const isProd = process.env['NODE_ENV'] === 'production';
    const common = {
      httpOnly: true,
      sameSite: 'strict' as const,
      secure: isProd,
    };

    res.cookie('access_token', access, {
      ...common,
      maxAge: 1000 * 60 * 60 * 7,
    });
    res.cookie('refresh_token', refresh, {
      ...common,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }

  private clearCookies(res: Response): void {
    res.clearCookie('access_token', { httpOnly: true, sameSite: 'strict' });
    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'strict' });
  }
}
