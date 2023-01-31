import { Command, CommandRunner, Option } from 'nest-commander';
import * as fs from 'fs';
import { createQueryBuilder } from 'typeorm';
import { UserService } from '../user/user.service';

@Command({ name: 'dumpdata', description: 'Dump table data to a json file' })
export class DumpDataCommand implements CommandRunner {
  constructor(private readonly userService: UserService) {}

  async run(passedParam: string[], options): Promise<void> {
    await this.dumpData(options);
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

  async dumpData({ table }) {
    const rawData = await createQueryBuilder(table).getMany();
    fs.writeFileSync(`out-${table}.json`, JSON.stringify(rawData, null, 2));
  }
}
