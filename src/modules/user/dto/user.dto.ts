import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '@common/abstract/dto/abstract.dto';
import { RoleType } from '@constants';

import type { UserEntity } from '../entities/user.entity';

export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends AbstractDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ enum: RoleType })
  role: RoleType;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  isActive?: boolean;

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.email = user.email;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.isActive = options?.isActive;
  }
}
