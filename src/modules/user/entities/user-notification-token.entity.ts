import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@common/abstract/abstract.entity';
import type { UserNotificationTokenOptions } from '@modules/user/dto/user-notification-tokens.dto';
import { UserNotificationTokenDto } from '@modules/user/dto/user-notification-tokens.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import { UseDto } from '@src/decorators';

@UseDto(UserNotificationTokenDto)
@Entity()
export class UserNotificationTokenEntity extends AbstractEntity<
  UserNotificationTokenDto,
  UserNotificationTokenOptions
> {
  @Column({ unique: true })
  token: string;

  @Column({ nullable: true })
  firstError?: Date;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.notificationTokens)
  user: UserEntity;
}
