import { Argv, Arguments, CommandModule } from 'yargs'

import interact from 'yargs-interactive'

import createVault from '../../vault'

interface UpdateOptions {
  key?: string
  username?: string
  password?: string
}

export class SecretUpdateCommand implements CommandModule {
  command = 'update [key] [username] [password]'

  builder(argv: Argv) {
    return argv
  }

  async handler(args: Arguments & UpdateOptions) {
    const vault = await createVault()

    const selected = await interact().interactive({
      interactive: {
        default: !args.key,
      },
      key: {
        choices: vault.list(),
        default: args.key,
        describe: 'select secret',
        prompt: 'always',
        type: 'list',
      },
    })

    if (!args.key) {
      const secret = vault.read(selected.key)

      const credentials = await interact().interactive({
        interactive: {
          default: !args.key,
        },
        username: {
          default: secret.username,
          describe: 'username',
          prompt: 'always',
          type: 'input',
        },
        password: {
          default: secret.password,
          describe: 'password',
          prompt: 'always',
          type: 'password',
        },
      })

      await vault.write(selected.key, credentials.username, credentials.password)
    } else {
      await vault.write(args.key!, args.username!, args.password!)
    }
  }
}

export default new SecretUpdateCommand()
