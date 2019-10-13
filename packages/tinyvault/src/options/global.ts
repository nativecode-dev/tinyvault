import os from 'os'

import { Argv, Options } from 'yargs'

export default function(argv: Argv) {
  return argv
    .option<string, Options>('profile', {
      default: os.hostname(),
      description: 'profile',
    })
    .option<string, Options>('username', {
      default: os.userInfo().username,
      description: 'username',
    })
}
