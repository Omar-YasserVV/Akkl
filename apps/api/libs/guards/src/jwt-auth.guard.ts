// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Request, Response } from 'express';
// import { BlackListService } from './services/blacklist.service';

// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly blacklistService: BlackListService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     // 1. Get request and response objects from the context
//     const httpContext = context.switchToHttp();
//     const request = httpContext.getRequest<Request>();
//     const response = httpContext.getResponse<Response>();

//     const accessToken = request.cookies?.access_token;
//     const refreshToken = request.cookies?.refresh_token;

//     if (!accessToken && !refreshToken) {
//       throw new UnauthorizedException('No authentication token found');
//     }

//     // 2. Check Blacklist
//     const isInvalid =
//       await this.blacklistService.isTokenBlacklisted(refreshToken);
//     if (isInvalid) {
//       this.clearCookies(response);
//       throw new UnauthorizedException('Token is blacklisted');
//     }

//     try {
//       // 3. Try to verify Access Token
//       const decoded = await this.jwtService.verifyAsync(accessToken, {
//         secret: process.env.JWT_SECRET,
//       });
//       request['user'] = decoded;
//       return true; // Access granted
//     } catch (error: any) {
//       // 4. Handle Expired Access Token with Refresh Token
//       if (error.name === 'TokenExpiredError' && refreshToken) {
//         return this.handleRefreshToken(request, response, refreshToken);
//       }
//       throw new UnauthorizedException('Invalid access token');
//     }
//   }

//   private async handleRefreshToken(
//     req: Request,
//     res: Response,
//     refreshToken: string,
//   ): Promise<boolean> {
//     try {
//       const decodedRefresh = await this.jwtService.verifyAsync(refreshToken, {
//         secret: process.env.JWT_REFRESH_SECRET,
//       });

//       const payload = { sub: decodedRefresh.sub };

//       // Generate New Tokens
//       const newAccessToken = await this.jwtService.signAsync(payload, {
//         secret: process.env.JWT_SECRET,
//         expiresIn: (process.env.JWT_EXPIRATION_TIME || '7h') as any,
//       });

//       const newRefreshToken = await this.jwtService.signAsync(payload, {
//         secret: process.env.JWT_REFRESH_SECRET,
//         expiresIn: (process.env.JWT_EXPIRATION_TIME_REFRESH_TOKEN ||
//           '7d') as any,
//       });

//       // Set New Cookies
//       this.setCookies(res, newAccessToken, newRefreshToken);

//       req['user'] = payload;
//       return true; // Access granted after refresh
//     } catch {
//       this.clearCookies(res);
//       throw new UnauthorizedException('Invalid or expired refresh token');
//     }
//   }

//   private setCookies(res: Response, access: string, refresh: string) {
//     const isProd = process.env.NODE_ENV === 'production';
//     res.cookie('access_token', access, {
//       httpOnly: true,
//       sameSite: 'strict',
//       secure: isProd,
//       maxAge: 1000 * 60 * 60 * 7,
//     });
//     res.cookie('refresh_token', refresh, {
//       httpOnly: true,
//       sameSite: 'strict',
//       secure: isProd,
//       maxAge: 1000 * 60 * 60 * 24 * 7,
//     });
//   }

//   private clearCookies(res: Response) {
//     res.clearCookie('access_token', { httpOnly: true, sameSite: 'strict' });
//     res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'strict' });
//   }
// }
