import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import type { FindOptionsWhere } from 'typeorm';

import { UserEntity } from '@modules/user/entities/user.entity';
import { Exists } from '@validators/exists.validator';

export class SendVerificationEmailDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  @Exists([
    UserEntity,
    (validationArguments): FindOptionsWhere<UserEntity> => ({
      email: validationArguments.value,
    }),
  ])
  email: string;
}
