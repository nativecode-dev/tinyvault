import { Argv, Arguments, CommandModule, Options } from 'yargs'

import interact from 'yargs-interactive'
import createVault from '../../vault'

interface ShowOptions {
  key?: string
  passwordOnly?: boolean
}

export class SecretShowCommand implements CommandModule {
  command = 'show [key]'

  builder(argv: Argv) {
    return argv.option<string, Options>('password-only', {
      default: false,
      type: 'boolean',
    })
  }

  async handler(args: Arguments & ShowOptions) {
    const vault = await createVault()

    const result = await Promise.resolve(
      interact()
        .usage('$0 secret show <key>')
        .interactive({
          interactive: {
            default: !args.key,
          },
          key: {
            choices: vault.list(),
            default: args.key,
            describe: 'secret',
            prompt: 'if-no-arg',
            type: 'list',
          },
        }),
    )

    const secret = vault.read(result.key || args.key)

    if (args.passwordOnly) {
      console.log(secret.password)
    } else {
      console.log(secret)
    }
  }
}

export default new SecretShowCommand()
