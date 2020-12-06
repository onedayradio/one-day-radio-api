import { expect } from 'chai'

import { TestsUtil } from '../../tests.util'
import { DevicesService, UsersService } from '../../../../src/components'
import sinon from 'sinon'
import { SpotifyClient } from '../../../../src/shared'
import { devicesMock } from '../../fixtures/spotify-api.mocks'

const testsUtil = new TestsUtil()

describe('Devices Service', () => {
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

  it('should load the user devices', async () => {
    const sandbox = sinon.createSandbox()
    sandbox.stub(SpotifyClient, 'getPlayerDevices').resolves(devicesMock)
    const usersService = new UsersService(testsUtil.session)
    const devicesService = new DevicesService(testsUtil.session)
    const user = await usersService.loadByEmail('sandra.aguilar@gmail.com')
    const devicesLoaded = await devicesService.loadPlayerDevices(user)
    expect(devicesLoaded.length).to.equal(2)
    sandbox.restore()
  })
})
