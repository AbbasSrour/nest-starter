import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordPayloadDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  expiration: string;

  constructor(data: { token: string; expiration: string }) {
    this.token = data.token;
    this.expiration = data.expiration;
  }
}
