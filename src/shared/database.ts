import neo4j, { Session, Config, Driver } from 'neo4j-driver'

import { getValue, isLocal, isTest } from '.'
import { generalLogger } from './logs'

let driver: any = null

export const createNeo4JDriver = (cachedDriver: Driver | null): Driver => {
  if (cachedDriver) {
    generalLogger.info('using cached neo4j driver...')
    driver = cachedDriver
    return cachedDriver
  }
  const neo4jUrl = getValue('neo4j_url')
  const username = getValue('neo4j_username')
  const password = getValue('neo4j_password')
  const options = isLocal() || isTest() ? undefined : ({ encrypted: 'ENCRYPTION_ON' } as Config)
  driver = neo4j.driver(neo4jUrl, neo4j.auth.basic(username, password), options)
  return driver
}

export const getNeo4JSession = (): Session => {
  const session = driver.session()
  return session
}
