import merge from 'deepmerge'
import PouchDB from 'pouchdb'

import Find from 'pouchdb-find'
import Upsert from 'pouchdb-upsert'
import Http from 'pouchdb-adapter-http'
import Memory from 'pouchdb-adapter-memory'

import { TinyVaultOptions } from './TinyVaultOptions'

import Logger from './Logger'

const DefaultOptions: Partial<TinyVaultOptions> = {
  adapter: 'memory',
  host: 'localhost',
  name: 'vault',
  port: 5984,
  protocol: 'http',
}

function createRemoteInstance<T>(url: string, options: Partial<TinyVaultOptions>): PouchDB.Database<T> {
  const pouch = new PouchDB<T>(url, {
    adapter: 'http',
    auth: {
      username: options.username,
      password: options.password,
    },
  })

  return pouch
}

function createEphemeralInstance<T>(options: Partial<TinyVaultOptions>): PouchDB.Database<T> {
  const pouch = new PouchDB<T>(options.name, {
    adapter: 'memory',
  })

  return pouch
}

function createWebSqlInstance<T>(options: Partial<TinyVaultOptions>): PouchDB.Database<T> {
  const pouch = new PouchDB<T>(options.name, {
    adapter: 'websql',
  })

  return pouch
}

export class TinyVaultRemote<T extends {}> {
  private readonly db: PouchDB.Database<T>
  private readonly options: TinyVaultOptions

  private readonly log = Logger.extend('vault-remote')

  constructor(options: Partial<TinyVaultOptions>) {
    this.options = merge.all<TinyVaultOptions>([DefaultOptions, options], { clone: true })

    PouchDB.plugin(Http)
    PouchDB.plugin(Find)
    PouchDB.plugin(Memory)
    PouchDB.plugin(Upsert)

    switch (this.options.adapter) {
      case 'http':
        this.db = createRemoteInstance(this.remoteUrl(false), this.options)
        break

      case 'websql':
        this.db = createWebSqlInstance(this.options)
        break

      default:
        this.db = createEphemeralInstance(this.options)
        break
    }

    this.log.debug(this.db.toString())
  }

  initialize(): Promise<void> {
    return Promise.resolve()
  }

  get(key: string): Promise<T & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta> {
    this.log.debug('get', key)
    return this.db.get(key, { latest: true })
  }

  remove(value: T & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta): Promise<PouchDB.Core.Response> {
    this.log.debug('remove', value)
    return this.db.remove(value)
  }

  upsert(key: string, secret: T): Promise<PouchDB.UpsertResponse> {
    this.log.debug('upsert', key)
    return this.db.upsert(key, doc => this.patch(doc, secret))
  }

  private patch(source: Partial<PouchDB.Core.Document<T>>, secret: Partial<T>): T {
    return merge.all<T>([source, secret], { clone: true })
  }

  private remoteUrl(auth: boolean = true): string {
    if (this.options.username && this.options.password && auth) {
      const auth = `${this.options.username}:${this.options.password}`
      return `${this.options.protocol}://${auth}@${this.options.host}:${this.options.port}/${this.options.name}`
    }

    return `${this.options.protocol}://${this.options.host}:${this.options.port}/${this.options.name}`
  }
}
