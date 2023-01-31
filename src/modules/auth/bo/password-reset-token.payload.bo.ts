import type { UserEntity } from '@modules/user/entities/user.entity';

export class PasswordResetTokenPayloadBo {
  token: string;

  expiration: string;

  user: UserEntity;

  constructor(data: { token: string; expiration: string; user: UserEntity }) {
    this.expiration = data.expiration;
    this.token = data.token;
    this.user = data.user;
  }
}
