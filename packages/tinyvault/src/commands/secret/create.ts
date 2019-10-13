import { Argv, Arguments, CommandModule } from 'yargs'

import interact from 'yargs-interactive'

import createVault from '../../vault'

interface CreateOptions {
  key?: string
  username?: string
  password?: string
}

export class SecretCreateCommand implements CommandModule {
  command = 'create [key] [username] [password]'

  builder(argv: Argv) {
    return argv
  }

  async handler(args: Arguments & CreateOptions) {
    const vault = await createVault()

    const result = await interact().interactive({
      interactive: {
        default: !args.key,
      },
      key: {
        default: args.key,
        describe: 'secret',
        prompt: 'always',
        type: 'input',
      },
      username: {
        default: args.username,
        describe: 'username',
        prompt: 'always',
        type: 'input',
      },
      password: {
        default: args.password,
        describe: 'password',
        prompt: 'always',
        type: 'password',
      },
    })

    await vault.write(result.key, result.username, result.password)
  }
}

export default new SecretCreateCommand()
