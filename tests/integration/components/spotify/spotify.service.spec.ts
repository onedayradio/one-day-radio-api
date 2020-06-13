import sinon from 'sinon'
import request from 'request'
import { expect } from 'chai'

import { testsSetup } from '../../tests.util'
import { SpotifyService, UsersService } from '../../../../src/components'
import { ids } from '../../fixtures-ids'
import { devicesMock, playListMock, searchSongsMock } from '../../mock-data/spotify-api.mocks'
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

  it('should get a playlist', async () => {
    sinon.stub(request, 'get').yields(null, { statusCode: 200 }, playListMock)
    const { users, playList } = ids
    const user = await usersService.getDetailById(users.sanId)
    const spotifyService = new SpotifyService(user)
    const searchResponse = await spotifyService.getPlayList(playList.yesterdayId)
    expect(searchResponse).to.deep.equal(playListMock)
    ;(request.get as any).restore()
  })

  it('should throw unexpected errors when getting a playlist', async () => {
    const { users, playList } = ids
    const sandbox = sinon.createSandbox()
    sandbox.stub(SpotifyClient, 'refreshAccessToken').callsFake(async () => {
      throw new Error('Unexpected error')
    })
    try {
      const user = await usersService.getDetailById(users.sanId)
      const spotifyService = new SpotifyService(user)
      await spotifyService.getPlayList(playList.yesterdayId)
    } catch (error) {
      expect(error.message).to.equal('Unexpected error')
    }
    sandbox.restore()
  })

  it('should refresh token if unauthorized error on get playlist', async () => {
    const { users, playList } = ids
    const sandbox = sinon.createSandbox()

    const getPlayList = sandbox.stub(SpotifyClient, 'getPlayList')
    getPlayList.onFirstCall().rejects(new SpotifyUnauthorizedError('invalid access token'))
    getPlayList.onSecondCall().resolves(playListMock)
    sandbox.stub(SpotifyClient, 'refreshAccessToken').resolves('')

    const user = await usersService.getDetailById(users.sanId)
    const spotifyService = new SpotifyService(user)
    const searchResponse = await spotifyService.getPlayList(playList.yesterdayId)
    expect(searchResponse).to.deep.equal(playListMock)
    sandbox.restore()
  })

  it('should create a playlist', async () => {
    sinon.stub(request, 'post').yields(null, { statusCode: 200 }, playListMock)
    const { users } = ids
    const user = await usersService.getDetailById(users.sanId)
    const spotifyService = new SpotifyService(user)
    const searchResponse = await spotifyService.createPlayList({ name: '', description: '' })
    expect(searchResponse).to.deep.equal(playListMock)
    ;(request.post as any).restore()
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

  it('should get the user devices', async () => {
    sinon.stub(request, 'get').yields(null, { statusCode: 200 }, devicesMock)
    const { users } = ids
    const user = await usersService.getDetailById(users.sanId)
    const spotifyService = new SpotifyService(user)
    const searchResponse = await spotifyService.loadPlayerDevices()
    expect(searchResponse).to.deep.equal(devicesMock.devices)
    ;(request.get as any).restore()
  })
})
