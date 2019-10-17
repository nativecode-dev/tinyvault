import { Argv, Arguments, CommandModule } from 'yargs'

import interact from 'yargs-interactive'

import createVault from '../../vault'

export class SecretDeleteCommand implements CommandModule {
  command = 'delete [key]'

  builder(argv: Argv) {
    return argv
  }

  async handler(args: Arguments) {
    const vault = await createVault()

    const result = await Promise.resolve(
      interact().interactive({
        interactive: {
          default: !args.key,
        },
        key: {
          choices: vault.list(),
          describe: 'secret',
          prompt: 'always',
          type: 'list',
        },
      }),
    )

    await vault.delete(result.key)
  }
}

export default new SecretDeleteCommand()
