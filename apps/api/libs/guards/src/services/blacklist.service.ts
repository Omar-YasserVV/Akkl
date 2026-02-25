import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../db/generated/client/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@app/db';
import { tokenDto } from '@app/common/dtos/UserDto/token.dto';

@Injectable()
export class BlackListService {
  constructor(private readonly prisma: PrismaService) {}

  async pushBlacklistedToken(data: tokenDto) {
    console.log('--- Blacklist DB Attempt ---');
    console.log('Payload:', data);
    if (!data) return;

    try {
      await this.prisma.tokenBlacklist.create({
        data: { token: data.Token },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code !== 'P2002') {
          throw error;
        }
        return;
      }
      throw error;
    }
  }
  async isTokenBlacklisted(token: string) {
    const found = await this.prisma.tokenBlacklist.findUnique({
      where: { token },
    });
    return !!found;
  }
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
