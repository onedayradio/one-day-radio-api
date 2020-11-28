import { Driver, Session } from 'neo4j-driver'
import chai from 'chai'
import chaiSubset from 'chai-subset'

import { createNeo4JDriver } from '../../src/shared'
import { insertAllDataQuery } from './fixtures/db-seed'

chai.use(chaiSubset)

export class TestsUtil {
  driver: Driver
  isSessionClosed = false
  private _session: Session

  constructor() {
    console.log('creating neo4j driver and session...')
    this.driver = createNeo4JDriver(null)
    this._session = this.driver.session()
  }

  set session(session: Session) {
    this._session = session
  }

  get session(): Session {
    if (this.isSessionClosed) {
      console.log('creating new neo4j session...')
      this.isSessionClosed = false
      this._session = this.driver.session()
      return this._session
    }
    return this._session
  }

  async setupData(): Promise<void> {
    await this.cleanUpDatabase()
    await this.session.run(insertAllDataQuery)
  }

  async cleanUpDatabase(): Promise<void> {
    await this.session.run('MATCH (n) DETACH DELETE n;')
  }

  async closeSession(): Promise<void> {
    await this._session.close()
    console.log('closing neo4j session...')
    this.isSessionClosed = true
  }

  async closeDriverAndSession(): Promise<void> {
    await this._session.close()
    await this.driver.close()
    console.log('closing neo4j driver and session...')
    this.isSessionClosed = true
  }
}
