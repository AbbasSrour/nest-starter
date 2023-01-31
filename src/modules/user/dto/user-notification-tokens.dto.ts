import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '@common/abstract/dto/abstract.dto';
import type { UserNotificationTokenEntity } from '@modules/user/entities/user-notification-token.entity';
import { UserEntity } from '@modules/user/entities/user.entity';

// eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-empty-interface
export interface UserNotificationTokenOptions {}

export class UserNotificationTokenDto extends AbstractDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  firstError?: Date;

  @ApiProperty()
  user: UserEntity;

  constructor(userNotificationToken: UserNotificationTokenEntity) {
    super(userNotificationToken);
    this.token = userNotificationToken.token;
    this.firstError = userNotificationToken.firstError;
    this.user = userNotificationToken.user;
  }
}
