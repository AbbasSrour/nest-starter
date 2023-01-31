import { IsNotEmpty, IsString } from 'class-validator';
import type { FindOptionsWhere } from 'typeorm';

import { UserNotificationTokenEntity } from '@modules/user/entities/user-notification-token.entity';
import { Unique } from '@validators/unique.validator';

export class CreateUserNotificationTokenDto {
  @IsString()
  @Unique([
    UserNotificationTokenEntity,
    (validationArguments): FindOptionsWhere<UserNotificationTokenEntity> => ({
      token: validationArguments.value,
    }),
  ])
  @IsNotEmpty()
  token: string;
}
