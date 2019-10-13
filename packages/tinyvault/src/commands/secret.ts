import { Arguments, Argv, CommandModule } from 'yargs'

import SecretCreateCommand from './secret/create'
import SecretDeleteCommand from './secret/delete'
import SecretListCommand from './secret/list'
import SecretShowCommand from './secret/show'
import SecretUpdateCommand from './secret/update'

export class SecretCommand implements CommandModule {
  aliases = ['secret']
  command = 'secret <create|delete|list|update>'

  builder(argv: Argv): Argv {
    return argv
      .command(SecretCreateCommand)
      .command(SecretDeleteCommand)
      .command(SecretListCommand)
      .command(SecretShowCommand)
      .command(SecretUpdateCommand)
  }

  handler(args: Arguments) {}
}

export default new SecretCommand()
