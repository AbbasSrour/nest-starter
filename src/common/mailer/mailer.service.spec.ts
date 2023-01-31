import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { MailerService } from './mailer.service';

describe('MailSenderService', () => {
  let service: MailerService;

  beforeEach(async () => {
    // eslint-disable-next-line @next/next/no-assign-module-variable
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerService],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
