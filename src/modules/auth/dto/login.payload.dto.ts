import { ApiProperty } from '@nestjs/swagger';

import { AccessTokenPayloadBo } from '@modules/auth/bo/access-token.payload.bo';
import { RefreshTokenPayloadBo } from '@modules/auth/bo/refresh-token.payload.bo';
import { UserDto } from '@modules/user/dto/user.dto';

export class LoginPayloadDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: AccessTokenPayloadBo })
  access_token: AccessTokenPayloadBo;

  @ApiProperty({ type: RefreshTokenPayloadBo })
  refresh_token: RefreshTokenPayloadBo;

  constructor(
    user: UserDto,
    accessToken: AccessTokenPayloadBo,
    refreshToken: RefreshTokenPayloadBo
  ) {
    this.user = user;
    this.access_token = accessToken;
    this.refresh_token = refreshToken;
  }
}
