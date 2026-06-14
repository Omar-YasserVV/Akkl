import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger'; // ⚡ Use @nestjs/swagger for proper Swagger integration
import { IsDateString, IsIn, IsOptional } from 'class-validator';
import { BaseUserDto } from './create.user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(BaseUserDto, ['password', 'email'] as const),
) {
  @ApiPropertyOptional({
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
  })
  @IsOptional()
  @IsIn(['male', 'female', 'other', 'prefer_not_to_say'])
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';

  @ApiPropertyOptional({ example: '1995-04-20' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
