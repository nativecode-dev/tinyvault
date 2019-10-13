import 'mocha'

import os from 'os'

import expect from './expect'

import { TinyVaultOptions, TinyVaultSecret, CREATE_VAULT, TinyVault } from '../src'

describe('when using TinyVault', async () => {
  const PASSWORD = 'global-password'
  const PROFILE = os.hostname()
  const USERNAME = os.userInfo().username

  const options: Partial<TinyVaultOptions> = {
    adapter: 'http',
    name: USERNAME,
    username: 'admin',
    password: 'admin',
  }

  let vault: TinyVault

  const SECRET: TinyVaultSecret = {
    key: 'test',
    password: 'test-password',
    username: 'test-username',
  }

  before(async () => {
    vault = await CREATE_VAULT(PROFILE, PASSWORD, options)
  })

  it('should store secret', async () => {
    expect(vault.write(SECRET.key, SECRET.username, SECRET.password)).to.eventually.not.be.rejected
  })

  it('should retrieve secret', async () => {
    const secret = vault.read(SECRET.key)
    expect(secret.password).to.equal('test-password')
  })

  it('should delete secret', async () => {
    expect(vault.delete(SECRET.key)).to.eventually.not.be.rejected
  })
})
