import { createStore, KeyStore, KeysData } from 'key-store'

import { TinyVaultSecret } from './TinyVaultSecret'
import { TinyVaultRemote } from './TinyVaultRemote'

import Logger from './Logger'

export class TinyVaultKeyStore {
  private readonly log = Logger.extend('key-store')

  constructor(private readonly profile: string, private readonly vault: TinyVaultRemote<KeysData<string>>) {}

  async createKeyStore(): Promise<KeyStore<TinyVaultSecret, string>> {
    const data = await this.load()
    this.log.debug('create-key-store', data)
    return createStore(data => this.save(data), data, { iterations: 10000 })
  }

  private async load(): Promise<KeysData<string> | undefined> {
    try {
      const existing = await this.vault.get(this.profile)
      this.log.debug('load-existing', this.profile, existing)
      return existing ? existing : undefined
    } catch {
      return undefined
    }
  }

  private async save(data: KeysData<string>): Promise<void> {
    await this.vault.upsert(this.profile, data)
  }
}
