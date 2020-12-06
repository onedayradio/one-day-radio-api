import { expect } from 'chai'

import { TestsUtil } from '../tests.util'
import { QueryHelper } from '../../../src/shared'
import { getUserIdsQuery, getAllUsers } from '../fixtures/db-seed'
import { expectedAllUsersQueryResult } from '../snapshots/queryHelper'
import { User } from '../../../src/types'

const testsUtil = new TestsUtil()

describe('QueryHelper', () => {
  beforeEach((done: any) => {
    testsUtil.setupData().then(() => done())
  })

  afterEach((done: any) => {
    testsUtil.closeSession().then(() => {
      done()
    })
  })

  after((done) => {
    testsUtil.closeDriverAndSession().then(() => done())
  })

  it('should execute query and return first object parsed as a simple plain object', async () => {
    const queryHelper = new QueryHelper(testsUtil.session)
    const response = await queryHelper.executeQueryAndReturnFirst<any>({ query: getUserIdsQuery })
    const keys = Object.keys(response)
    expect(keys).to.deep.equal(['juanId', 'sanId', 'pabloId', 'joseId'])
  })

  it('should execute query and return objects parsed as a simple plain objects', async () => {
    const queryHelper = new QueryHelper(testsUtil.session)
    const response = await queryHelper.executeQuery<User[]>({ query: getAllUsers, mapBy: 'users' })
    expect(response).to.containSubset(expectedAllUsersQueryResult)
  })
})
