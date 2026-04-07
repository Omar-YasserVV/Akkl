import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class tokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'ya29.a0ARrdaM-abcdef1234567890' })
  Token!: string;
}
