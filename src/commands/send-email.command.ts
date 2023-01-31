import { Command, CommandRunner, Option } from 'nest-commander';
import { MailerService } from '@nestjs-modules/mailer';
import * as moment from 'moment';

@Command({ name: 'sendemail', description: 'Send email to a single user' })
export class SendEmailCommand implements CommandRunner {
  constructor(private mailerService: MailerService) {}

  async run(passedParam: string[], options): Promise<void> {
    await this.sendEmail(options);
  }

  @Option({
    flags: '-r, --receiver [receiver]',
    description: "Receiver's email address",
  })
  table(val: string): string {
    return val;
  }

  async sendEmail({ receiver }) {
    await this.mailerService.sendMail({
      to: receiver,
      subject: 'New order created',
      template: './order',
      context: {
        orderId: 'ABCDEFGH',
        orderDate: moment(new Date()).format('DD/MM/YY'),
        orderCurrency: 'LBP',
        orderTotal: '1234000',
      },
    });
  }
}
