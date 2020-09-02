import request from 'request'
import sinon from 'sinon'
import mongodb from 'mongodb'
import { fn as moment } from 'moment'
import { expect } from 'chai'
import * as base64Image from 'node-base64-image'

import { PlaylistsService, UsersService, SpotifyService } from '../../../../src/components'
import { PlaylistsDao } from '../../../../src/components/playList/playlists.dao'
import { testsSetup } from '../../tests.util'
import { SpotifyClient } from '../../../../src/shared'
import { playListItemsMock, playListMock, playListSongs } from '../../mock-data/spotify-api.mocks'
import { ids } from '../../fixtures-ids'
import {
  expectedPlaylistSongs,
  expectedPlaylistContains,
  expectedAddSongToPlaylist,
  expectedAddSongToPlaylistEarthSong,
} from '../../snapshots/playlistSongs'

const playlistService = new PlaylistsService()
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
    const playListDescription = playlistService.createPlaylistDescription('Test name')
    expect(playListDescription).to.equal(
      'This playlist has been created to you, from your community. Test name',
    )
  })

  it('should create a play list name', async () => {
    const playListDescription = playlistService.createPlaylistName('Rock')
    expect(playListDescription).to.equal('One day Radio. Rock playlist')
  })

  it('should create play list data', async () => {
    sandbox.stub(moment, 'format').returns('2020-12-24')
    const { genres } = ids
    const expectedData = {
      name: 'One day Radio. Heavy Metal playlist',
      description:
        'This playlist has been created to you, from your community. One day Radio. Heavy Metal playlist',
      genreId: genres.metalId,
    }
    const playListData = await playlistService.createPlaylistData(genres.metalId)
    expect(playListData).to.deep.equal(expectedData)
  })

  it('should create a play list', async () => {
    sandbox.stub(PlaylistsDao.prototype, 'loadByGenreId').resolves(null)
    sandbox.stub(SpotifyClient, 'createPlaylist').resolves(playListMock)
    sandbox.stub(SpotifyClient, 'refreshAccessToken').resolves('')
    sandbox.stub(PlaylistsService.prototype, 'uploadPlaylistImage')
    const { genres } = ids
    const data = await playlistService.createPlaylistData(genres.metalId)
    const playListData = await playlistService.createPlaylist(data)
    expect(playListData).to.equal(playListMock)
  })

  it('should get all songs a user has added to a playlist', async () => {
    const { users, playlist } = ids
    let songs = await playlistService.getPlaylistSongsByUser(playlist.popId, users.pabloId)
    expect(songs).to.deep.equal([])
    songs = await playlistService.getPlaylistSongsByUser(playlist.metalId, users.juanId)
    expect(songs).to.containSubset(expectedPlaylistSongs)
  })

  it('should load all songs for a specific playlist given a genre id', async () => {
    const { genres } = ids
    sandbox.stub(SpotifyClient, 'getPlaylistItems').resolves(playListItemsMock)
    sandbox.stub(SpotifyClient, 'refreshAccessToken').resolves('')
    let paginatedPlaylistSongs = await playlistService.loadPlaylistSongs(genres.metalId)
    expect(paginatedPlaylistSongs).to.deep.equal(playListSongs)
    paginatedPlaylistSongs = await playlistService.loadPlaylistSongs(genres.metalId, 0, 10)
    expect(paginatedPlaylistSongs).to.deep.equal(playListSongs)
  })

  it('should validate playlist duplicate songs', async () => {
    const wrathchildId = '1SpuDZ7y1W4vaCzHeLvsf7'
    const trooperId = '4OROzZUy6gOWN4UGQVaZMF'
    const everDreamId = '3hjkzZUy6gOcnu7GQV9311'
    const containsResponse = await playlistService.playlistContains(ids.playlist.metalId, [
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
      await playlistService.addSongToPlaylist(
        user,
        badId,
        {
          id: '1',
          name: 'song1',
          artists: 'Iron Maiden',
          uri: 'song1',
        },
        { year: '2020', month: '07', day: '24' },
      )
    } catch (error) {
      expect(error.message).to.equal(`Playlist with id ${badId} does not exists!`)
    }
  })

  it('should throw error if user has reach its max amount of songs per playlist', async () => {
    const user = await usersService.getDetailById(ids.users.sanId)
    try {
      await playlistService.addSongToPlaylist(
        user,
        '44',
        {
          id: '1',
          name: 'song1',
          artists: 'Iron Maiden',
          uri: 'song1',
        },
        { year: '2020', month: '07', day: '24' },
      )
    } catch (error) {
      expect(error.message).to.equal('User has reached max amount of songs for this playlist')
    }
  })

  it('should throw error if trying to add duplicate song to a playlist', async () => {
    const user = await usersService.getDetailById(ids.users.juanId)
    try {
      await playlistService.addSongToPlaylist(
        user,
        '44',
        {
          id: '2QagWuAL61R8DLydEte3t5',
          name: 'Somewhere I Belong',
          artists: 'Linkin Park',
          uri: 'spotify:track:2QagWuAL61R8DLydEte3t5',
        },
        { year: '2020', month: '07', day: '24' },
      )
    } catch (error) {
      expect(error.message).to.equal(
        'Song Somewhere I Belong by Linkin Park is already in this playlist',
      )
    }
  })

  it('should throw error if trying to add song to a playlist when passing ivalid date params', async () => {
    const user = await usersService.getDetailById(ids.users.juanId)
    try {
      await playlistService.addSongToPlaylist(
        user,
        '44',
        {
          id: '3311WuAL61R8DLydEt1133',
          name: 'Ghost Love Score',
          artists: 'Nightwish',
          uri: 'spotify:track:3311WuAL61R8DLydEt1133',
        },
        { year: '2020', month: '77', day: '24' },
      )
    } catch (error) {
      expect(error.message).to.equal('Invalid date format')
    }
  })

  it('should add a new song to a playlist when maxSongs per genre has not been reached', async () => {
    sandbox.stub(SpotifyService.prototype, 'addSongToPlaylist').resolves(true)
    const user = await usersService.getDetailById(ids.users.juanId)
    let userSongs = await playlistService.getPlaylistSongsByUser(ids.playlist.metalId, user)
    expect(userSongs.length).to.equal(2)
    const song = await playlistService.addSongToPlaylist(
      user,
      '33',
      {
        id: '3311WuAL61R8DLydEt1133',
        name: 'Ghost Love Score',
        artists: 'Nightwish',
        uri: 'spotify:track:3311WuAL61R8DLydEt1133',
      },
      { year: '2020', month: '07', day: '24' },
    )
    expect(song.spotifyId).to.containSubset(expectedAddSongToPlaylist.spotifyId)
    userSongs = await playlistService.getPlaylistSongsByUser(ids.playlist.metalId, user)
    expect(userSongs.length).to.equal(3)
  })

  it('should add a new song to a playlist when maxSongs per genre has been reached', async () => {
    sandbox.stub(SpotifyService.prototype, 'addSongToPlaylist').resolves(true)
    sandbox.stub(SpotifyService.prototype, 'removeSongFromPlaylist').resolves(true)
    const user = await usersService.getDetailById(ids.users.juanId)
    let userSongs = await playlistService.getPlaylistSongsByUser(ids.playlist.popId, user)
    expect(userSongs.length).to.equal(1)
    const song = await playlistService.addSongToPlaylist(
      user,
      '88',
      {
        id: '2QagWuAL61R8DLydEte344',
        name: 'Earth Song',
        artists: 'Michael Jackson',
        uri: 'spotify:track:2QagWuAL61R8DLydEte344',
      },
      { year: '2020', month: '07', day: '24' },
    )
    expect(song.toObject()).to.containSubset(expectedAddSongToPlaylistEarthSong)
    userSongs = await playlistService.getPlaylistSongsByUser(ids.playlist.popId, user)
    expect(userSongs.length).to.equal(2)
    const allSongs = await playlistService.loadAllPlaylistSongs(ids.playlist.popId)
    expect(allSongs.length).to.equal(2)
  })

  it('should return false if an error happens when uploading playlist image to spotify', async () => {
    const { genres } = ids
    sandbox.stub(base64Image, 'encode').throwsException(new Error('wrong image format'))
    const result = await playlistService.uploadPlaylistImage('1133', genres.metalId)
    expect(result).to.equal(false)
  })

  it('should upload playlist image cover to spotify', async () => {
    const { genres } = ids
    sandbox.stub(base64Image, 'encode').returns(Promise.resolve('base64-encoded-image'))
    sandbox.stub(SpotifyClient, 'refreshAccessToken')
    sinon.stub(request, 'put').yields(null, { statusCode: 200 }, {})
    const result = await playlistService.uploadPlaylistImage('1133', genres.metalId)
    expect(result).to.equal(true)
  })
})