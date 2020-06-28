import request from 'request'
import sinon from 'sinon'
import mongodb from 'mongodb'
import { fn as moment } from 'moment'
import { expect } from 'chai'
import * as base64Image from 'node-base64-image'

import { PlayListService, UsersService, SpotifyService } from '../../../../src/components'
import { PlayListDao } from '../../../../src/components/playList/playList.dao'
import { testsSetup } from '../../tests.util'
import { SpotifyClient } from '../../../../src/shared'
import { playListMock } from '../../mock-data/spotify-api.mocks'
import { ids } from '../../fixtures-ids'
import {
  expectedPlaylistSongs,
  expectedPlaylistContains,
  expectedAddSongToPlaylist,
} from 'tests/integration/snapshots/playlist-songs'

const playListService = new PlayListService()
const usersService = new UsersService()

const sandbox = sinon.createSandbox()

describe('Playlist Service', () => {
  beforeEach((done: any) => {
    void testsSetup(done)
  })
  afterEach(() => {
    if (sandbox.restore) {
      sandbox.restore()
    }
    if ((request.put as any).restore) {
      ;(request.put as any).restore()
    }
  })

  it('should create a play list description', () => {
    const playListDescription = playListService.createPlayListDescription('Test name')
    expect(playListDescription).to.equal(
      'This playlist has been created to you, from your community. Test name',
    )
  })

  it('should create a play list name', async () => {
    const playListDate = {
      day: '24',
      month: '12',
      year: '2020',
    }
    const playListDescription = playListService.createPlayListName('Rock', playListDate)
    expect(playListDescription).to.equal('One day Radio. Rock playlist - 2020-12-24')
  })

  it('should create play list data', async () => {
    sandbox.stub(moment, 'format').returns('2020-12-24')
    const { genres } = ids
    const expectedData = {
      name: 'One day Radio. Heavy Metal playlist - 2020-12-24',
      description:
        'This playlist has been created to you, from your community. One day Radio. Heavy Metal playlist - 2020-12-24',
      genreId: genres.metalId,
      year: '2020',
      month: '12',
      day: '24',
    }
    const playListData = await playListService.createPlayListData(genres.metalId, {
      year: '2020',
      month: '12',
      day: '24',
    })
    expect(playListData).to.deep.equal(expectedData)
  })

  it('should create a play list', async () => {
    sandbox.stub(PlayListDao.prototype, 'load').resolves(null)
    sandbox.stub(SpotifyClient, 'createPlayList').resolves(playListMock)
    sandbox.stub(SpotifyClient, 'refreshAccessToken').resolves('')
    sandbox.stub(PlayListService.prototype, 'uploadPlaylistImage')
    const { users, genres } = ids
    const data = await playListService.createPlayListData(genres.metalId, {
      year: '2020',
      month: '12',
      day: '24',
    })
    const playListData = await playListService.createPlayList(users.pabloId, data)
    expect(playListData).to.equal(playListMock)
  })

  it('should get all songs a user has added to a playlist', async () => {
    const { users, playList } = ids
    let songs = await playListService.getPlaylistSongsByUser(playList.metalId, users.sanId)
    expect(songs).to.deep.equal([])
    songs = await playListService.getPlaylistSongsByUser(playList.metalId, users.juanId)
    expect(songs).to.containSubset(expectedPlaylistSongs)
  })

  it('should validate playlist duplicate songs', async () => {
    const wrathchildId = '1SpuDZ7y1W4vaCzHeLvsf7'
    const trooperId = '4OROzZUy6gOWN4UGQVaZMF'
    const everDreamId = '3hjkzZUy6gOcnu7GQV9311'
    const containsResponse = await playListService.playlistContains(ids.playList.metalId, [
      wrathchildId,
      trooperId,
      everDreamId,
    ])
    expect(containsResponse).to.deep.equal(expectedPlaylistContains)
  })

  it('should throw error if adding songs to an unexisting playlist', async () => {
    const badId = new mongodb.ObjectID() + ''
    const user = await usersService.getDetailById(ids.users.juanId)
    try {
      await playListService.addSongToPlaylist(user, badId, {
        id: '1',
        name: 'song1',
        artists: 'Iron Maiden',
        uri: 'song1',
      })
    } catch (error) {
      expect(error.message).to.equal(`Playlist with id ${badId} does not exists!`)
    }
  })

  it('should throw error if user has reach its max amount of songs per playlist', async () => {
    const user = await usersService.getDetailById(ids.users.sanId)
    try {
      await playListService.addSongToPlaylist(user, '44', {
        id: '1',
        name: 'song1',
        artists: 'Iron Maiden',
        uri: 'song1',
      })
    } catch (error) {
      expect(error.message).to.equal('User has reached max amount of songs for this playlist')
    }
  })

  it('should throw error if trying to add duplicate song to a playlist', async () => {
    const user = await usersService.getDetailById(ids.users.juanId)
    try {
      await playListService.addSongToPlaylist(user, '44', {
        id: '2QagWuAL61R8DLydEte3t5',
        name: 'Somewhere I Belong',
        artists: 'Linkin Park',
        uri: 'spotify:track:2QagWuAL61R8DLydEte3t5',
      })
    } catch (error) {
      expect(error.message).to.equal(
        'Song Somewhere I Belong by Linkin Park is already in this playlist',
      )
    }
  })

  it('should add a new song to a playlist', async () => {
    sandbox.stub(SpotifyService.prototype, 'addSongToPlaylist').resolves(true)
    const user = await usersService.getDetailById(ids.users.juanId)
    let userSongs = await playListService.getPlaylistSongsByUser(ids.playList.metalId, user._id)
    expect(userSongs.length).to.equal(2)
    const song = await playListService.addSongToPlaylist(user, '33', {
      id: '3311WuAL61R8DLydEt1133',
      name: 'Ghost Love Score',
      artists: 'Nightwish',
      uri: 'spotify:track:3311WuAL61R8DLydEt1133',
    })
    expect(song).to.containSubset(expectedAddSongToPlaylist)
    userSongs = await playListService.getPlaylistSongsByUser(ids.playList.metalId, user._id)
    expect(userSongs.length).to.equal(3)
  })

  it('should return false if an error happens when uploading playlist image to spotify', async () => {
    const { genres } = ids
    sandbox.stub(base64Image, 'encode').throwsException(new Error('wrong image format'))
    const result = await playListService.uploadPlaylistImage('1133', genres.metalId)
    expect(result).to.equal(false)
  })

  it('should upload playlist image cover to spotify', async () => {
    const { genres } = ids
    sandbox.stub(base64Image, 'encode').returns(Promise.resolve('base64-encoded-image'))
    sandbox.stub(SpotifyClient, 'refreshAccessToken')
    sinon.stub(request, 'put').yields(null, { statusCode: 200 }, {})
    const result = await playListService.uploadPlaylistImage('1133', genres.metalId)
    expect(result).to.equal(true)
  })
})
