import { BadRequestException } from '@nestjs/common';

export class JWTInvalidTokenException extends BadRequestException {
  constructor(error?: string) {
    super('error.token.invalid', error);
  }
}

export class JWTExpiredTokenException extends BadRequestException {
  constructor(error?: string) {
    super('error.token.expired', error);
  }
}
