import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenPayloadBo {
  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  token: string;

  constructor(data: { expiresIn: number; accessToken: string }) {
    this.expiresIn = data.expiresIn;
    this.token = data.accessToken;
  }
}
