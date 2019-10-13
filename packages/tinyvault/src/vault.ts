import os from 'os'

import { fs } from '@nofrills/fs'
import { CREATE_VAULT } from '@nofrills/tinyvault-lib'

export interface Credentials {
  host: string
  port: number
  protocol: 'http' | 'https'
  username: string
  password: string
  keypass: string
  profile: string
  sync: string
}

export default async function createVault() {
  const filename = fs.join(process.cwd(), '.tinyvault.json')

  if ((await fs.exists(filename)) === false) {
    throw new Error(`No credentials file found: ${filename}. Run configure to create one.`)
  }

  const config = await fs.json<Credentials>(filename)

  const vault = await CREATE_VAULT(config.profile, config.keypass, {
    adapter: config.sync,
    name: os.userInfo().username,
    username: config.username,
    password: config.password,
  })

  return vault
}
