import { Test } from '@nestjs/testing';

import { AuthService } from '@modules/auth/auth.service';

describe('AuthService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: AuthService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = app.get<AuthService>(AuthService);
  });
});
