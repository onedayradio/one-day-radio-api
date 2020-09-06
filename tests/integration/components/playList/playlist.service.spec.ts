import { expect } from 'chai'
import Sinon from 'sinon'

import { TestsUtil } from '../../tests.util2'
import {
  GenresService,
  PlaylistsService,
  UsersService,
  SpotifyService,
} from '../../../../src/components'
import { SpotifyClient } from '../../../../src/shared'
import { playlistMock } from '../../fixtures/spotify-api.mocks'
import {
  expectedAddSong1,
  expectedAddSong2,
  expectedAllActiveSongs,
  expectedHeavyMetalPlaylist,
  expectedNewPlaylist,
  expectedPunkPlaylist,
  expectedRemovedSong,
  expectedSongsBySpotifyIds,
} from '../../snapshots/playlists'
import { testSong1, testSong2, testSong3 } from '../../fixtures/songs'

const testsUtil = new TestsUtil()

const sandbox = Sinon.createSandbox()

describe.only('PlaylistsService', () => {
  beforeEach((done: any) => {
    sandbox.stub(SpotifyClient, 'createPlaylist').resolves(playlistMock)
    sandbox.stub(SpotifyClient, 'refreshAccessToken').returns(Promise.resolve('spotify-token'))
    sandbox.stub(SpotifyClient, 'uploadPlaylistCoverImage')
    sandbox.stub(SpotifyService.prototype, 'playOnDevice').returns(Promise.resolve(true))
    sandbox.stub(SpotifyService.prototype, 'addSongToPlaylist').returns(Promise.resolve(true))
    testsUtil.setupData().then(() => done())
  })

  afterEach((done: any) => {
    sandbox.restore()
    testsUtil.closeSession().then(() => {
      done()
    })
  })

  after((done) => {
    testsUtil.closeDriverAndSession().then(() => done())
  })

  it('should create a play list description', () => {
    const playlistService = new PlaylistsService(testsUtil.session)
    const playlistDescription = playlistService.createPlaylistDescription('Test name')
    expect(playlistDescription).to.equal(
      'This playlist has been created for you by the community. Test name',
    )
  })

  it('should create a play list name', async () => {
    const playlistService = new PlaylistsService(testsUtil.session)
    const playlistDescription = playlistService.createPlaylistName('Rock')
    expect(playlistDescription).to.equal('One day Radio. Rock playlist')
  })

  it('should create play list data', async () => {
    const genresService = new GenresService(testsUtil.session)
    const allGenres = await genresService.loadAll({ orderBy: 'order' })
    const playlistService = new PlaylistsService(testsUtil.session)
    const expectedData = {
      name: 'One day Radio. Heavy Metal playlist',
      description:
        'This playlist has been created for you by the community. One day Radio. Heavy Metal playlist',
      genreId: allGenres[0].id,
    }
    const playlistData = await playlistService.createPlaylistData(allGenres[0].id)
    expect(playlistData).to.deep.equal(expectedData)
  })

  it('should create a play list', async () => {
    const playlistService = new PlaylistsService(testsUtil.session)
    const genresService = new GenresService(testsUtil.session)
    const allGenres = await genresService.loadAll({ orderBy: 'order' })
    const data = await playlistService.createPlaylistData(allGenres[0].id)
    const newPlaylist = await playlistService.create(data)
    expect(newPlaylist).to.containSubset(expectedNewPlaylist)
  })

  it('should load a playlist by genreId or create it if it does not exists', async () => {
    const playlistService = new PlaylistsService(testsUtil.session)
    const genresService = new GenresService(testsUtil.session)
    const allGenres = await genresService.loadAll({ orderBy: 'order' })
    const heavyMetalGenre = allGenres[0]
    const playlist = await playlistService.getByGenreIdOrCreate(heavyMetalGenre.id)
    expect(playlist).to.containSubset(expectedHeavyMetalPlaylist)

    const punkGenre = allGenres[1]
    const punkPlaylist = await playlistService.getByGenreIdOrCreate(punkGenre.id)
    expect(punkPlaylist).to.containSubset(expectedPunkPlaylist)
    expect(punkPlaylist.genreId).to.equal(punkGenre.id)
  })

  it('should throw error on playOnDevice if playlist does not exists', async () => {
    try {
      const usersService = new UsersService(testsUtil.session)
      const juan = await usersService.loadByEmail('juan@gmail.com')
      const playlistService = new PlaylistsService(testsUtil.session)
      await playlistService.playOnDevice(juan, 1133, '4455')
    } catch (error) {
      expect(error.message).to.equal('Playlist for the genre Id 1133 does not exists!')
    }
  })

  it('should playOnDevice', async () => {
    const genresService = new GenresService(testsUtil.session)
    const allGenres = await genresService.loadAll({ orderBy: 'order' })
    const heavyMetalGenre = allGenres[0]
    const usersService = new UsersService(testsUtil.session)
    const juan = await usersService.loadByEmail('juan@gmail.com')
    const playlistService = new PlaylistsService(testsUtil.session)
    const response = await playlistService.playOnDevice(juan, heavyMetalGenre.id, '4455')
    expect(response).to.equal(true)
  })

  it('should load playlists songs by user', async () => {
    const usersService = new UsersService(testsUtil.session)
    const juan = await usersService.loadByEmail('juan@gmail.com')
    const playlistService = new PlaylistsService(testsUtil.session)
    const playlists = await playlistService.loadAll()
    const playlist1 = playlists[0]
    const playlistSongs = await playlistService.loadActiveSongsByUser(playlist1.id, juan.id)
    playlistSongs.forEach((song) => expect(song.sharedOn).not.to.be.undefined)
    const songsSpotifyIds = playlistSongs.map(({ song }) => song.spotifyId)
    expect(songsSpotifyIds).to.deep.equal(['1155', '1133', '1144'])
  })

  it('should load playlists songs by spotify ids', async () => {
    const playlistService = new PlaylistsService(testsUtil.session)
    const playlists = await playlistService.loadAll()
    const playlist1 = playlists[0]
    const playlistSongs = await playlistService.loadActiveSongsBySpotifyIds(playlist1.id, [
      '1144',
      '1155',
      '1166',
      '4433',
      '5533',
    ])
    expect(playlistSongs).to.containSubset(expectedSongsBySpotifyIds)
    playlistSongs.forEach((song) => expect(song.sharedOn).not.to.be.undefined)
    const songsSpotifyIds = playlistSongs.map(({ song }) => song.spotifyId)
    expect(songsSpotifyIds).to.deep.equal(['1155', '4433', '1144'])
  })

  it('should validate if a playlist contains or not an array of spotifyIds', async () => {
    const playlistService = new PlaylistsService(testsUtil.session)
    const playlists = await playlistService.loadAll()
    const playlist1 = playlists[0]
    const duplicatesInfo = await playlistService.playlistContains(playlist1.id, [
      '1144',
      '2233',
      'newSpotifyId',
    ])
    expect(duplicatesInfo).to.deep.equal([
      { spotifyId: '1144', duplicate: true },
      { spotifyId: '2233', duplicate: false },
      { spotifyId: 'newSpotifyId', duplicate: false },
    ])
  })

  it('should load all playlist active songs', async () => {
    const playlistService = new PlaylistsService(testsUtil.session)
    const playlists = await playlistService.loadAll()
    const playlist1 = playlists[0]
    const playlistSongs = await playlistService.loadAllPlaylistActiveSongs(playlist1.id)
    const songsSpotifyIds = playlistSongs.map(({ song }) => song.spotifyId)
    expect(playlistSongs).to.containSubset(expectedAllActiveSongs)
    playlistSongs.forEach((song) => expect(song.sharedOn).not.to.be.undefined)
    expect(songsSpotifyIds).to.deep.equal(['1155', '4433', '1133', '1144'])
  })

  it('should remove a song from a playlist', async () => {
    const playlistService = new PlaylistsService(testsUtil.session)
    const playlists = await playlistService.loadAll()
    const playlist1 = playlists[0]
    const [existingPlaylistSong] = await playlistService.loadActiveSongsBySpotifyIds(playlist1.id, [
      '1133',
    ])
    const removedSong = await playlistService.removeSongFromPlaylist(
      playlist1.id,
      existingPlaylistSong.song.id,
    )
    expect(removedSong).to.containSubset(expectedRemovedSong)
  })

  it('should not add song to playlist if max songs allowed per user has been reached', async () => {
    try {
      const usersService = new UsersService(testsUtil.session)
      const juan = await usersService.loadByEmail('juan@gmail.com')
      const genresService = new GenresService(testsUtil.session)
      const allGenres = await genresService.loadAll({ orderBy: 'order' })
      const heavyMetalGenre = allGenres[0]
      const playlistService = new PlaylistsService(testsUtil.session)
      await playlistService.addSongToPlaylist(juan.id, heavyMetalGenre.id, testSong1)
    } catch (error) {
      expect(error.message).to.equal('User has reached max amount of songs for this playlist')
    }
  })

  it('should not add song to playlist if the song is present and active in the playlist', async () => {
    try {
      const usersService = new UsersService(testsUtil.session)
      const jose = await usersService.loadByEmail('jose.morales@gmail.com')
      const genresService = new GenresService(testsUtil.session)
      const allGenres = await genresService.loadAll({ orderBy: 'order' })
      const heavyMetalGenre = allGenres[0]
      const playlistService = new PlaylistsService(testsUtil.session)
      await playlistService.addSongToPlaylist(jose.id, heavyMetalGenre.id, testSong2)
    } catch (error) {
      expect(error.message).to.equal(
        'Song Hallowed Be Thy Name by Iron Maiden is already in this playlist',
      )
    }
  })

  it('should add a song to playlist -> non existing song in db', async () => {
    const usersService = new UsersService(testsUtil.session)
    const jose = await usersService.loadByEmail('jose.morales@gmail.com')
    const genresService = new GenresService(testsUtil.session)
    const allGenres = await genresService.loadAll({ orderBy: 'order' })
    const heavyMetalGenre = allGenres[0]
    const playlistService = new PlaylistsService(testsUtil.session)
    const playlistSong = await playlistService.addSongToPlaylist(
      jose.id,
      heavyMetalGenre.id,
      testSong1,
    )
    expect(playlistSong).to.containSubset(expectedAddSong1)

    const playlists = await playlistService.loadAll()
    const playlist1 = playlists[0]
    const activePlaylistSongs = await playlistService.loadAllPlaylistActiveSongs(playlist1.id)
    const spotifyIds = activePlaylistSongs.map((playlistSong) => playlistSong.song.spotifyId)
    expect(spotifyIds).to.deep.equal(['ava11', '1155', '4433', '1133', '1144'])
  })

  it('should add a song to playlist -> existing song in db', async () => {
    const usersService = new UsersService(testsUtil.session)
    const san = await usersService.loadByEmail('sandra.aguilar@gmail.com')
    const genresService = new GenresService(testsUtil.session)
    const allGenres = await genresService.loadAll({ orderBy: 'order' })
    const heavyMetalGenre = allGenres[0]
    const playlistService = new PlaylistsService(testsUtil.session)
    const playlistSong = await playlistService.addSongToPlaylist(
      san.id,
      heavyMetalGenre.id,
      testSong3,
    )
    expect(playlistSong).to.containSubset(expectedAddSong2)

    const playlists = await playlistService.loadAll()
    const playlist1 = playlists[0]
    const activePlaylistSongs = await playlistService.loadAllPlaylistActiveSongs(playlist1.id)
    const spotifyIds = activePlaylistSongs.map((playlistSong) => playlistSong.song.spotifyId)
    expect(spotifyIds).to.deep.equal(['5533', '1155', '4433', '1133', '1144'])
  })

  it.only('should add a song to a playlist -> max songs per playlist reached (should remove oldest and add new song)', async () => {
    expect(true).to.equal(false)
  })
})
