import { Command, CommandRunner } from 'nest-commander';
import { prompt } from 'inquirer';
import { UserService } from '../user/user.service';

@Command({ name: 'createuser', description: 'Create a user' })
export class CreateUserCommand implements CommandRunner {
  constructor(private readonly userService: UserService) {}

  async run(): Promise<void> {
    await this.createUserInteractive();
  }

  async createUserInteractive() {
    const user: any = {};
    const questions = [
      {
        type: 'input',
        name: 'firstName',
        message: 'first name: ',
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'last name: ',
      },
      {
        type: 'input',
        name: 'email',
        message: 'email: ',
      },
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
      {
        type: 'input',
        message: 'phone number: ',
        name: 'phoneNumber',
        choices: ['true', 'false'],
      },
    ];

    const answers = await prompt(questions);
    user.firstName = answers['firstName'];
    user.lastName = answers['lastName'];
    if (answers['password'] === answers['confirmPassword']) {
      user.password = answers['password'];
    } else {
      return;
    }
    user.phoneNumber = answers['phoneNumber'];
    user.isSuperUser = true;
    user.email = answers['email'];
    try {
      await this.userService.create(user);
    } catch (e) {
      console.log(e);
    }
  }
}
