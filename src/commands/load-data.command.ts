import * as fs from 'fs';
import { Command, CommandRunner, Option } from 'nest-commander';
import { getConnection } from 'typeorm';
import { UserService } from '../user/user.service';

@Command({ name: 'loaddata', description: 'Save the json file into a table' })
export class LoadDataCommand implements CommandRunner {
  constructor(private readonly userService: UserService) {}

  async run(passedParam: string[], options): Promise<void> {
    await this.loadData(options);
  }

  @Option({
    flags: '-t, --table [table]',
    description: 'Table',
  })
  table(val: string): string {
    return val;
  }

  @Option({
    flags: '-j, --json [json]',
    description: 'Json Path',
  })
  json(val: string): string {
    return val;
  }

  async loadData({ json: jsonPath, table }) {
    const jsonData = fs.readFileSync(jsonPath);
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(table)
      .values(jsonData)
      .execute();
  }
}
