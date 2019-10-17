import yargs from 'yargs'

import 'pouchdb-find'
import 'pouchdb-upsert'

import DefaultCommand from './commands/default'

process.on('uncaughtException', (error: Error) => console.log(error))
process.on('unhandledRejection', (reason: {} | null | undefined) => console.log(reason))

yargs
  .scriptName('tinyvault')
  .command(DefaultCommand)
  .help()
  .showHelpOnFail(true)
  .parse()
