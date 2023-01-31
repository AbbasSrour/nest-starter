import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenPayloadBo {
  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  token: string;

  constructor(data: { expiresIn: number; refreshToken: string }) {
    this.expiresIn = data.expiresIn;
    this.token = data.refreshToken;
  }
}
