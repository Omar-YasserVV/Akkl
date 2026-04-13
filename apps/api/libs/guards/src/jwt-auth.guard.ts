import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { BlackListService } from './services/blacklist.service';

/**
 * JwtAuthGuard
 * -------------
 * This guard is responsible for handling JWT-based authentication.
 * It checks the HTTP request for access and refresh tokens, verifies their validity,
 * manages blacklisting, and supports refreshing expired tokens via the refresh token.
 *
 * - If no tokens are present, it denies access.
 * - If the refresh token is blacklisted, it clears authentication cookies and denies access.
 * - If the access token is invalid or expired (and there is a refresh token), it attempts to refresh tokens.
 * - If valid, it injects the user payload into the request object for downstream use.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly blacklistService: BlackListService,
  ) {}

  /**
   * Main guard logic.
   * - Checks for access and refresh tokens in cookies.
   * - If access token is valid, attaches user to request and allows access.
   * - If access token is expired/invalid but refresh token is present, attempts to refresh.
   * - If refresh fails or both tokens are absent/invalid, denies access.
   *
   * @param context ExecutionContext provides details about the current request.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const accessToken = request.cookies?.access_token;
    const refreshToken = request.cookies?.refresh_token;

    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException('No authentication token found');
    }

    // Check if the refresh token is blacklisted (even if only access token is expired/missing).
    const isInvalid =
      await this.blacklistService.isTokenBlacklisted(refreshToken);
    if (isInvalid) {
      this.clearCookies(response);
      throw new UnauthorizedException('Token is blacklisted');
    }

    if (!accessToken) {
      // If no access token, but refresh exists and is not blacklisted, try refreshing
      return this.handleRefreshToken(request, response, refreshToken);
    }

    try {
      // Verify the access token
      const decoded = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = decoded;
      return true;
    } catch (error: any) {
      // If token expired, try with refresh token
      if (error.name === 'TokenExpiredError' && refreshToken) {
        return this.handleRefreshToken(request, response, refreshToken);
      }
      throw new UnauthorizedException('Invalid access token');
    }
  }

  /**
   * Attempts to validate and use the refresh token to generate new tokens and update cookies.
   * - Verifies the refresh token.
   * - Rebuilds the JWT payload (sub, role, type, branchId, as available).
   * - Issues new access and refresh tokens.
   * - Sets the new tokens into cookies.
   * - Attaches the new user info to the request.
   *
   * @param req Express Request object
   * @param res Express Response object
   * @param refreshToken Refresh token string from cookies
   */
  private async handleRefreshToken(
    req: Request,
    res: Response,
    refreshToken: string,
  ): Promise<boolean> {
    try {
      const decodedRefresh = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Rebuild JWT payload to preserve user-specific claims
      const payload: Record<string, unknown> = { sub: decodedRefresh.sub };
      if (decodedRefresh['role'] !== undefined) {
        payload['role'] = decodedRefresh['role'];
      }
      if (decodedRefresh['type'] !== undefined) {
        payload['type'] = decodedRefresh['type'];
      }
      if (decodedRefresh['branchId'] !== undefined) {
        payload['branchId'] = decodedRefresh['branchId'];
      }

      // Sign new tokens
      const newAccessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: (process.env.JWT_EXPIRATION_TIME || '7h') as any,
      });

      const newRefreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: (process.env.JWT_EXPIRATION_TIME_REFRESH_TOKEN ||
          '7d') as any,
      });
      this.setCookies(res, newAccessToken, newRefreshToken);

      req['user'] = payload;
      return true;
    } catch {
      // Clear cookies on refresh/token error
      this.clearCookies(res);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Sets authentication cookies (access and refresh tokens) for the client.
   * Sets httpOnly and secure flags for production.
   *
   * @param res Express Response
   * @param access String, signed access JWT
   * @param refresh String, signed refresh JWT
   */
  private setCookies(res: Response, access: string, refresh: string) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('access_token', access, {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProd,
      maxAge: 1000 * 60 * 60 * 7,
    });
    res.cookie('refresh_token', refresh, {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProd,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }

  /**
   * Clears authentication cookies (access and refresh tokens).
   *
   * @param res Express Response
   */
  private clearCookies(res: Response) {
    res.clearCookie('access_token', { httpOnly: true, sameSite: 'strict' });
    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'strict' });
  }
}
