import { get } from 'lodash'

import { version } from '../../../package.json'

const defaults = {
  environment: 'local',
  test: {
    neo4j_url: 'bolt://localhost:7687',
    neo4j_username: 'neo4j',
    neo4j_password: 'test',
    token_secret: 'a_test_secret',
    token_expiration: '1d',
    security_salt_rounds: 4,
    spotify_client_id: 'client_id',
    spotify_client_secret: 'client_secret',
    spotify_redirect_url: 'redirect_url',
    spotify_scopes: 'some scopes',
    frontend_url: 'http://localhost:3001',
    port: 5678,
    max_user_songs_per_playlist: 3,
  },
}

export const getEnvironment = (): string => {
  if (!process.env.NODE_ENV) {
    return defaults.environment
  }
  return process.env.NODE_ENV
}

export const isTest = (): boolean => {
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
  return version
}

export const isLocal = (): boolean => {
  const environment = getEnvironment()
  return environment === 'local'
}

export const isProd = (): boolean => {
  const environment = getEnvironment()
  return environment === 'production'
}
