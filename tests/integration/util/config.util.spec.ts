import { expect } from 'chai'

import {
  getValue,
  getValueAsInt,
  getVersion,
  isProd,
  getEnvironment,
} from '../../../src/shared/util/config'

describe('Config Util', () => {
  afterEach(() => {
    process.env.NODE_ENV = 'test'
  })

  it('should get app version', () => {
    const version = getVersion()
    expect(version).not.to.be.empty
  })

  it('should return value from detaults when NODE_ENV is test', () => {
    process.env.NODE_ENV = 'test'
    const value = getValue('port')
    expect(value).to.equal(5678)
  })

  it('should return value as integer', () => {
    const value = getValueAsInt('port')
    expect(value).to.equal(5678)
  })

  it('should know if current env is production or not', () => {
    process.env.NODE_ENV = 'production'
    const isProdEnv = isProd()
    expect(isProdEnv).to.equal(true)
  })

  it('should get the default environment', () => {
    delete process.env.NODE_ENV
    const defaultEnv = getEnvironment()
    expect(defaultEnv).to.deep.equal('local')
  })

  it('should return default value from detaults when NODE_ENV is not test', () => {
    process.env.NODE_ENV = 'dev'
    delete process.env.port
    const value = getValue('port', '8080')
    expect(value).to.equal('8080')
  })

  it('should return empty string if value not found and default value not defined', () => {
    process.env.NODE_ENV = 'dev'
    delete process.env.port
    const value = getValue('port')
    expect(value).to.equal('')
  })
})
