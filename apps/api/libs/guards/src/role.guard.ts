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

    let payload = request.user as { role?: string } | undefined;

    if (!payload?.role) {
      const accessToken = request.cookies?.access_token;
      if (!accessToken) {
        throw new UnauthorizedException('Access token missing from cookies');
      }
      try {
        payload = await this.jwtService.verifyAsync(accessToken, {
          secret: process.env.JWT_SECRET,
        });
        request.user = payload;
      } catch {
        throw new UnauthorizedException('Invalid or expired session');
      }
    }

    const hasPermission = requiredRoles.includes(payload.role as string);

    if (!hasPermission) {
      throw new ForbiddenException(
        `Access denied. Required: [${requiredRoles.join(', ')}]. Your role: ${payload.role}`,
      );
    }

    return true;
  }
}
