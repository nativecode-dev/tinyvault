import { KeyStore, KeysData } from 'key-store'

import { TinyVaultRemote } from './TinyVaultRemote'
import { TinyVaultSecret } from './TinyVaultSecret'
import { TinyVaultOptions } from './TinyVaultOptions'
import { TinyVaultKeyStore } from './TinyVaultKeyStore'

import Logger from './Logger'

export class TinyVault {
  private readonly log = Logger.extend('vault')

  constructor(private readonly keystore: KeyStore<TinyVaultSecret, string>, private readonly vaultPassword: string) {}

  delete(key: string): Promise<void> {
    this.log.debug('delete-key', key)
    return this.keystore.removeKey(key)
  }

  list(): string[] {
    return this.keystore.getKeyIDs().filter(key => ['_id', '_rev'].includes(key) === false)
  }

  read(key: string): TinyVaultSecret {
    this.log.debug('read-key', key)
    return this.keystore.getPrivateKeyData(key, this.vaultPassword)
  }

  write(key: string, username: string, password: string): Promise<void> {
    const data: TinyVaultSecret = {
      key,
      password,
      username,
    }

    this.log.debug('write-key', key, data)
    return this.keystore.saveKey(key, this.vaultPassword, data, key)
  }
}

export async function CREATE_VAULT(
  profile: string,
  vaultPassword: string,
  options: Partial<TinyVaultOptions>,
): Promise<TinyVault> {
  const remote = new TinyVaultRemote<KeysData<string>>(options)
  await remote.initialize()

  const keystore = new TinyVaultKeyStore(profile, remote)
  const vault = new TinyVault(await keystore.createKeyStore(), vaultPassword)

  return vault
}
