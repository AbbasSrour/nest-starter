import { UnprocessableEntityException } from '@nestjs/common';

export class AlreadyVerifiedError extends UnprocessableEntityException {
  constructor(error?: string) {
    super('error.token.invalid', error);
  }
}
