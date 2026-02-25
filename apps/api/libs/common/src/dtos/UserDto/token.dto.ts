import { IsString, IsNotEmpty } from 'class-validator';

export class tokenDto {
  @IsString()
  @IsNotEmpty()
  Token: string;
}
