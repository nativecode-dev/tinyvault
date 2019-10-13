import { Argv, Arguments, CommandModule } from 'yargs'

import createVault from '../../vault'

export class SecretListCommand implements CommandModule {
  command = 'list'

  builder(argv: Argv) {
    return argv
  }

  async handler(args: Arguments) {
    const vault = await createVault()
    vault.list().map(key => console.log(key))
  }
}

export default new SecretListCommand()
