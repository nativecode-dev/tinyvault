import { Arguments, Argv, CommandModule, PositionalOptions } from 'yargs'

import SecretCommand from './secret'
import ConfigureCommand from './configure'

import global from '../options/global'

export class DefaultCommand implements CommandModule {
  command = '$0 <configure|secret>'

  builder(argv: Argv) {
    return global(argv)
      .command(SecretCommand)
      .command(ConfigureCommand)
  }

  handler(args: Arguments) {
    console.log(args)
  }
}

export default new DefaultCommand()
