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

/**
 * RolesGuard
 * ----------
 * This guard enforces Role-Based Access Control (RBAC) for endpoints decorated with @Roles().
 *
 * - It obtains the list of allowed roles from metadata assigned by the @Roles() decorator.
 * - If the controller action does not specify any required roles, all authenticated users can proceed.
 * - It checks for the user's `role` in the request, or falls back to validating the JWT from the access token cookie.
 * - If the user does not possess one of the required roles, a ForbiddenException is thrown.
 * - If the user's role cannot be determined due to absence/invalidity of the JWT, an UnauthorizedException is thrown.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Determines whether the current request should be allowed based on user role.
   *
   * @param context The execution context containing the request and handler information.
   * @returns True if the user has an allowed role, otherwise throws Forbidden/Unauthorized exception.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve required roles from the @Roles() decorator, if present on handler or class
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If there are no specific roles required for this route, grant access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    /**
     * The user object should be attached to the request (typically by JwtAuthGuard).
     * If not present or missing a role, we attempt to verify and decode the JWT from cookies manually.
     */
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

    // Check if the user's role is found in any of the required roles
    const hasPermission = requiredRoles.includes(payload.role as string);

    if (!hasPermission) {
      throw new ForbiddenException(
        `Access denied. Required: [${requiredRoles.join(', ')}]. Your role: ${payload.role}`,
      );
    }

    return true;
  }
}
