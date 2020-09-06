import { expect } from 'chai'

import { testsSetup } from '../../tests.util'
import { DevicesService, UsersService } from '../../../../src/components'
import { ids } from '../../fixtures-ids'
import sinon from 'sinon'
import { SpotifyClient } from '../../../../src/shared'
import { devicesMock } from '../../fixtures/spotify-api.mocks'

const devicesService = new DevicesService()
const usersService = new UsersService()

describe('Devices Service', () => {
  beforeEach((done: any) => {
    void testsSetup(done)
  })

  it('should load the user devices', async () => {
    const { users } = ids
    const sandbox = sinon.createSandbox()
    sandbox.stub(SpotifyClient, 'getPlayerDevices').resolves(devicesMock)
    const user = await usersService.getDetailById(users.sanId)
    const devicesLoaded = await devicesService.loadPlayerDevices(user)
    expect(devicesLoaded.length).to.equal(2)
    sandbox.restore()
  })
})
