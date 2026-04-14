import { tokenDto } from '@app/common/dtos/UserDto/token.dto';
import { PrismaService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '../../../db/generated/client/client';

/**
 * Service to manage blacklisted (i.e., revoked or invalidated) JWT tokens.
 * Provides methods to add blacklisted tokens (for logout, rotation, forced sign-out, etc.),
 * check token blacklist status, and clean up expired blacklist entries.
 */
@Injectable()
export class BlackListService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Adds a token to the blacklist table. Should be called whenever a token is explicitly invalidated, e.g. on logout.
   * Ignores duplicate entries (token uniqueness error).
   * @param data An object containing the token string (data.Token).
   */
  async pushBlacklistedToken(data: tokenDto) {
    console.log('--- Blacklist DB Attempt ---');
    console.log('Payload:', data);
    if (!data) return;

    try {
      await this.prisma.tokenBlacklist.create({
        data: { token: data.Token },
      });
    } catch (error) {
      // Ignore duplicate entry error (token already blacklisted)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code !== 'P2002') {
          throw error;
        }
        return;
      }
      throw error;
    }
  }

  /**
   * Checks whether a specific token is present in the blacklist.
   * @param token The JWT string to check.
   * @returns true if blacklisted, false if not present or undefined input.
   */
  async isTokenBlacklisted(token: string | undefined) {
    if (!token) {
      return false;
    }
    const found = await this.prisma.tokenBlacklist.findUnique({
      where: { token },
    });
    return !!found;
  }

  /**
   * Scheduled task that runs every day at midnight to remove old blacklisted tokens (older than 7 days).
   * Helps reduce database bloat by pruning expired blacklist entries.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupBlacklistedTokens() {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 7);

    await this.prisma.tokenBlacklist.deleteMany({
      where: { createdAt: { lt: expirationDate } },
    });

    console.log('Expired blacklisted tokens removed');
  }
}
