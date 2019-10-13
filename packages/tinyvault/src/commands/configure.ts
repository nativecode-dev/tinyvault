import os from 'os'

import interactive from 'yargs-interactive'

import { fs } from '@nofrills/fs'
import { Arguments, Argv, CommandModule } from 'yargs'

export class ConfigureCommand implements CommandModule {
  aliases = ['config']
  command = 'configure'

  builder(argv: Argv) {
    return argv
  }

  async handler(args: Arguments) {
    const opts: interactive.Option = {
      interactive: {
        default: true,
      },
      host: {
        default: 'localhost',
        describe: 'host',
        prompt: 'always',
        type: 'input',
      },
      port: {
        default: 5984,
        describe: 'port',
        prompt: 'always',
        type: 'input',
      },
      protocol: {
        default: 'http',
        describe: 'protocol',
        prompt: 'always',
        type: 'input',
      },
      username: {
        default: 'admin',
        describe: 'username',
        prompt: 'always',
        type: 'input',
      },
      password: {
        default: 'admin',
        describe: 'password',
        prompt: 'always',
        type: 'input',
      },
      keypass: {
        default: 'global-password',
        describe: 'keypass',
        prompt: 'always',
        type: 'input',
      },
      profile: {
        default: os.hostname(),
        describe: 'profile',
        prompt: 'always',
        type: 'input',
      },
      sync: {
        choices: ['http', 'memory'],
        default: 'memory',
        describe: 'sync',
        prompt: 'always',
        type: 'input',
      },
    }

    const result = await interactive().interactive(opts)
    const filename = fs.join(process.cwd(), '.tinyvault.json')

    await fs.save(filename, {
      host: result.host,
      port: result.port,
      protocol: result.protocol,
      username: result.username,
      password: result.password,
      keypass: result.keypass,
      profile: result.profile,
      sync: result.sync,
    })
  }
}

export default new ConfigureCommand()
