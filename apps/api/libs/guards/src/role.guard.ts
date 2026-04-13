import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Get required roles from the @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // 2. Extract token from cookies (populated by cookie-parser in main.ts)
    const accessToken = request.cookies?.access_token;

    if (!accessToken) {
      throw new UnauthorizedException('Access token missing from cookies');
    }

    try {
      // 3. Verify and decode the token
      // Note: Ensure your JWT payload contains the 'role' property
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_SECRET,
      });

      // 4. Attach payload to request so controllers can use it
      request.user = payload;

      // 5. Check if the user's role matches the required roles
      const hasPermission = requiredRoles.includes(payload.role);

      if (!hasPermission) {
        throw new ForbiddenException(
          `Access denied. Required: [${requiredRoles.join(', ')}]. Your role: ${payload.role}`,
        );
      }

      return true;
    } catch (err) {
      // Handle cases where token is expired or altered
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}
