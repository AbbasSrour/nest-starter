import type { RoleType, TokenType } from '@constants';

export interface ITokenPayload {
  userId: Uuid;

  role: RoleType;

  tokenType: TokenType;
}
