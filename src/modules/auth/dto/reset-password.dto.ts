import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Match, PasswordField } from '@src/app/decorators';

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
