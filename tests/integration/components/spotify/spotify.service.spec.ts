import sinon from 'sinon'
import request from 'request'
import { expect } from 'chai'

import { testsSetup } from '../../tests.util'
import { SpotifyService, UsersService } from '../../../../src/components'
import { ids } from '../../fixtures-ids'
import { searchSongsMock } from '../../mock-data/spotify-api.mocks'
import { spotifyServiceSearchSongs } from '../../snapshots/spotify'
import { SpotifyClient, SpotifyUnauthorizedError } from '../../../../src/shared'

const usersService = new UsersService()

describe('SpotifyService', () => {
  beforeEach((done: any) => {
    void testsSetup(done)
  })

  it('should get spotify user access token', async () => {
    const { users } = ids
    const user = await usersService.getDetailById(users.sanId)
    const spotifyService = new SpotifyService(user)
    const accessToken = spotifyService.getUserAccessToken()
    expect(accessToken).to.equal('access-token')
  })

  it('should get spotify user refresh token', async () => {
    const { users } = ids
    const user = await usersService.getDetailById(users.sanId)
    const spotifyService = new SpotifyService(user)
    const accessToken = spotifyService.getUserRefreshToken()
    expect(accessToken).to.equal('refresh-token')
  })

  it('should search for songs', async () => {
    sinon.stub(request, 'get').yields(null, { statusCode: 200 }, searchSongsMock)
    const { users } = ids
    const user = await usersService.getDetailById(users.sanId)
    const spotifyService = new SpotifyService(user)
    const searchResponse = await spotifyService.searchSong('raw deal')
    expect(searchResponse).to.deep.equal(spotifyServiceSearchSongs)
    ;(request.get as any).restore()
  })

  it('should refresh token if unauthorized error on search songs', async () => {
    const { users } = ids
    const sandbox = sinon.createSandbox()
    sandbox.stub(SpotifyClient, 'searchSong').callsFake(async (accessToken: string) => {
      if (accessToken === 'access-token') {
        throw new SpotifyUnauthorizedError('invalid access token')
      }
      return searchSongsMock
    })
    sandbox.stub(SpotifyService.prototype, 'refreshAccessToken').callsFake(async () => {
      const joseUser = await usersService.getDetailById(users.joseId)
      return joseUser
    })
    const user = await usersService.getDetailById(users.sanId)
    const spotifyService = new SpotifyService(user)
    const searchResponse = await spotifyService.searchSong('raw deal')
    expect(searchResponse).to.deep.equal(spotifyServiceSearchSongs)
    sandbox.restore()
  })

  it('should throw unexpected errors when searching for a song', async () => {
    const { users } = ids
    const sandbox = sinon.createSandbox()
    sandbox.stub(SpotifyClient, 'searchSong').callsFake(async () => {
      throw new Error('Unexpected error')
    })
    try {
      const user = await usersService.getDetailById(users.sanId)
      const spotifyService = new SpotifyService(user)
      await spotifyService.searchSong('raw deal')
    } catch (error) {
      expect(error.message).to.equal('Unexpected error')
    }
    sandbox.restore()
  })

  it('should refresh access token and update user in database', async () => {
    const { users } = ids
    const sandbox = sinon.createSandbox()
    sandbox.stub(SpotifyClient, 'refreshAccessToken').returns(Promise.resolve('new-access-token'))
    const user = await usersService.getDetailById(users.sanId)
    const spotifyService = new SpotifyService(user)
    const updatedUser = await spotifyService.refreshAccessToken()
    expect(updatedUser.spotifyData.accessToken).to.equal('new-access-token')
    sandbox.restore()
  })
})
