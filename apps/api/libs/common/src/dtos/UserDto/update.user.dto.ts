import { OmitType, PartialType } from '@nestjs/swagger'; // ⚡ Use @nestjs/swagger for proper Swagger integration
import { CreateUserDto } from './create.user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'email'] as const),
) {}
