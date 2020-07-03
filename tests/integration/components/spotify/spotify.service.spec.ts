import sinon from 'sinon'
import request from 'request'
import { expect } from 'chai'

import { testsSetup } from '../../tests.util'
import { SpotifyService, UsersService } from '../../../../src/components'
import { ids } from '../../fixtures-ids'
import {
  devicesMock,
  playListItemsMock,
  playListMock,
  searchSongsMock,
} from '../../mock-data/spotify-api.mocks'
import { spotifyServiceSearchSongs } from '../../snapshots/spotify'
import { SpotifyClient } from '../../../../src/shared'

const usersService = new UsersService()
const sandbox = sinon.createSandbox()

describe('SpotifyService', () => {
  beforeEach((done: any) => {
    void testsSetup(done)
  })
  afterEach(() => {
    if (sandbox.restore) {
      sandbox.restore()
    }
    if ((request.post as any).restore) {
      ;(request.post as any).restore()
    }
    if ((request.get as any).restore) {
      ;(request.get as any).restore()
    }
  })

  it('should get spotify user access token', async () => {
    const { users } = ids
    const user = await usersService.getDetailById(users.sanId)
    const spotifyService = new SpotifyService()
    const accessToken = spotifyService.getUserAccessToken(user)
    expect(accessToken).to.equal('access-token')
  })

  it('should get spotify user refresh token', async () => {
    const { users } = ids
    const user = await usersService.getDetailById(users.sanId)
    const spotifyService = new SpotifyService()
    const accessToken = spotifyService.getUserRefreshToken(user)
    expect(accessToken).to.equal('refresh-token')
  })

  it('should search for songs', async () => {
    sandbox.stub(SpotifyClient, 'refreshAccessToken').resolves('')
    sinon.stub(request, 'get').yields(null, { statusCode: 200 }, searchSongsMock)
    const spotifyService = new SpotifyService()
    const searchResponse = await spotifyService.searchSong('raw deal')
    expect(searchResponse).to.deep.equal(spotifyServiceSearchSongs)
  })

  it('should get a playlist', async () => {
    sandbox.stub(SpotifyClient, 'refreshAccessToken').resolves('')
    sinon.stub(request, 'get').yields(null, { statusCode: 200 }, playListMock)
    const { playList } = ids
    const spotifyService = new SpotifyService()
    const searchResponse = await spotifyService.getPlayList(playList.yesterdayId)
    expect(searchResponse).to.deep.equal(playListMock)
  })

  it('should throw unexpected errors when getting a playlist', async () => {
    const { playList } = ids
    sandbox.stub(SpotifyClient, 'refreshAccessToken').callsFake(async () => {
      throw new Error('Unexpected error')
    })
    try {
      const spotifyService = new SpotifyService()
      await spotifyService.getPlayList(playList.yesterdayId)
    } catch (error) {
      expect(error.message).to.equal('Unexpected error')
    }
  })

  it('should create a playlist', async () => {
    sinon.stub(request, 'post').yields(null, { statusCode: 200 }, playListMock)
    const spotifyService = new SpotifyService()
    const searchResponse = await spotifyService.createPlayList({ name: '', description: '' })
    expect(searchResponse).to.deep.equal(playListMock)
  })

  it('should play a playlist on a device', async () => {
    const sandbox = sinon.createSandbox()
    sandbox.stub(SpotifyClient, 'getPlayList').resolves(playListMock)
    sandbox.stub(SpotifyClient, 'followPlayList').resolves(undefined)
    sandbox.stub(SpotifyClient, 'playOnDevice').resolves(undefined)
    const { users, devices, playList } = ids
    const user = await usersService.getDetailById(users.sanId)
    const spotifyService = new SpotifyService()
    const data = await spotifyService.playOnDevice(user, playList.todayId, devices.echoDot)
    expect(data).to.equal(true)
    sandbox.restore()
  })

  it('should refresh access token and update user in database', async () => {
    const { users } = ids
    sandbox.stub(SpotifyClient, 'refreshAccessToken').returns(Promise.resolve('new-access-token'))
    const user = await usersService.getDetailById(users.sanId)
    const spotifyService = new SpotifyService()
    const updatedUser = await spotifyService.refreshAccessToken(user)
    expect(updatedUser.spotifyData.accessToken).to.equal('new-access-token')
  })

  it('should get the user devices', async () => {
    sinon.stub(request, 'get').yields(null, { statusCode: 200 }, devicesMock)
    const { users } = ids
    const user = await usersService.getDetailById(users.sanId)
    const spotifyService = new SpotifyService()
    const searchResponse = await spotifyService.loadPlayerDevices(user)
    expect(searchResponse).to.deep.equal(devicesMock.devices)
  })

  it('should get the playlist items', async () => {
    sandbox.stub(SpotifyClient, 'refreshAccessToken').resolves('')
    sinon.stub(request, 'get').yields(null, { statusCode: 200 }, playListItemsMock)
    const { playList } = ids
    const spotifyService = new SpotifyService()
    const playListItems = await spotifyService.getPlayListItems(playList.metalId, 1, 0)
    expect(playListItems).to.deep.equal(playListItemsMock)
  })
})
