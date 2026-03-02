import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@app/db';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies?.access_token;

    if (!accessToken) {
      throw new UnauthorizedException('Access token missing');
    }

    let decoded: any;

    try {
      decoded = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    const hasPermission = requiredRoles.includes(user.role);

    if (!hasPermission) {
      throw new ForbiddenException(
        `Access denied. Required roles: [${requiredRoles.join(', ')}]. Your role: ${user.role}`,
      );
    }

    request.user = user;

    return true;
  }
}
