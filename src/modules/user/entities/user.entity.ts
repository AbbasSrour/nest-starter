import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '@common/abstract/abstract.entity';
import { RoleType } from '@constants';
import { UseDto, VirtualColumn } from '@decorators';
import { UserNotificationTokenEntity } from '@modules/user/entities/user-notification-token.entity';

import type { UserDtoOptions } from '../dto/user.dto';
import { UserDto } from '../dto/user.dto';

@UseDto(UserDto)
@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto, UserDtoOptions> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @VirtualColumn()
  fullName?: string;

  @OneToMany(() => UserNotificationTokenEntity, (userTokens) => userTokens.user)
  notificationTokens: UserNotificationTokenEntity[];
}
