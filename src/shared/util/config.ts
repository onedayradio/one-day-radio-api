import { get } from 'lodash'

const defaults = {
  environment: 'local',
  test: {
    mongodb_url: 'mongodb://localhost:27017/test?authSource=admin',
    mongodb_username: 'onedayradio-admin',
    mongodb_password: 'password',
    token_secret: 'a_test_secret',
    token_expiration: '1d',
    security_salt_rounds: 4,
    mailgun_apikey: 'an_awesome_key',
    mailgun_domain: 'awesome@domain.com',
    support_email: 'support@onedayradio.com',
    spotify_client_id: 'client_id',
    spotify_client_secret: 'client_secret',
    spotify_redirect_url: 'redirect_url',
    spotify_scopes: 'some scopes',
    frontend_url: 'http://localhost:3001',
    port: 5678,
  },
}

export const getEnvironment = (): string => {
  if (!process.env.NODE_ENV) {
    return defaults.environment
  }
  return process.env.NODE_ENV
}

const isTest = (): boolean => {
  const environment = getEnvironment()
  return environment.includes('test')
}

export const getValue = (key: string, defaultValue?: string): string => {
  const testsDefaultValue = get(defaults.test, key)
  if (isTest() && testsDefaultValue) {
    return testsDefaultValue
  }
  return process.env[key] || defaultValue || ''
}

export const getValueAsInt = (key: string): number => {
  const valueStr = getValue(key)
  return parseInt(valueStr)
}

export const getVersion = (): string => {
  return require('../../../package.json').version
}

export const isProd = (): boolean => {
  const environment = getEnvironment()
  return environment === 'production'
}
