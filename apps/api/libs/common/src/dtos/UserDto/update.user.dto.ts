import { OmitType, PartialType } from '@nestjs/swagger'; // ⚡ Use @nestjs/swagger for proper Swagger integration
import { BaseUserDto } from './create.user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(BaseUserDto, ['password', 'email'] as const),
) {}
