import { Module } from '@nestjs/common';

import { MailerService } from '@common/mailer/mailer.service';

@Module({
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
