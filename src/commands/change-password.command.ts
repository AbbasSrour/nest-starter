import { Command, CommandRunner, Option } from 'nest-commander';
import { prompt } from 'inquirer';
import { UserService } from '@modules/user/user.service';

@Command({ name: 'changeuserpassword', description: 'Change the password' })
export class ChangeUserPasswordCommand implements CommandRunner {
  constructor(private readonly userService: UserService) {}

  async run(passedParam: string[], options): Promise<void> {
    await this.changeUserPassword(options.email);
  }

  @Option({
    flags: '-e, --email [email]',
    description: 'Email',
  })
  email(val: string): string {
    return val;
  }
  async changeUserPassword(email) {
    const questions = [
      {
        type: 'password',
        message: 'password: ',
        name: 'password',
      },
      {
        type: 'password',
        message: 'confirm password: ',
        name: 'confirmPassword',
        mask: '*',
      },
    ];

    const answers = await prompt(questions);
    const user = await this.userService.findOne({ where: { email } });
    if (!user) {
      return;
    }
    if (answers['password'] === answers['confirmPassword']) {
      user.password = answers['password'];
    } else {
      console.log("Passwords don't match");
      return;
    }
    await this.userService.updatePassword(user);
  }
}
