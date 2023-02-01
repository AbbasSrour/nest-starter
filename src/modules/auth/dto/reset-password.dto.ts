import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { PasswordField } from '@src/decorators';
import { Match } from '@validators/match.validator';

export class ResetPasswordDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  token: string;

  @IsString()
  @ApiProperty()
  @MinLength(4)
  @MaxLength(32)
  @IsNotEmpty()
  @PasswordField()
  password: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @Match('password')
  confirm_password: string;
}
