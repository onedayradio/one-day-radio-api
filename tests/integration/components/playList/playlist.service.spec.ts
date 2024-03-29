import { expect } from 'chai'
import Sinon from 'sinon'

import { TestsUtil } from '../../tests.util'
import {
  GenresService,
  PlaylistsService,
  UsersService,
  SpotifyService,
} from '../../../../src/components'
import { SpotifyClient } from '../../../../src/shared'
import { playlistMock, searchSongsMock2 } from '../../fixtures/spotify-api.mocks'
import {
  expectedAddSong1,
  expectedAddSong2,
  expectedAddSong3,
  expectedAllActiveSongs,
  expectedHeavyMetalPlaylist,
  expectedNewPlaylist,
  expectedPunkPlaylist,
  expectedRemovedSong,
  expectedSearchSongs,
  expectedSongsBySpotifyIds,
} from '../../snapshots/playlists'
import { testSong1, testSong2, testSong3, testSong4 } from '../../fixtures/songs'

const testsUtil = new TestsUtil()

const sandbox = Sinon.createSandbox()

describe('PlaylistsService', () => {
  beforeEach((done: any) => {
    sandbox.stub(SpotifyClient, 'createPlaylist').resolves(playlistMock)
    sandbox.stub(SpotifyClient, 'refreshAccessToken').returns(Promise.resolve('spotify-token'))
    sandbox.stub(SpotifyClient, 'uploadPlaylistCoverImage')
    sandbox.stub(SpotifyClient, 'searchSong').returns(Promise.resolve(searchSongsMock2))
    sandbox.stub(SpotifyService.prototype, 'playOnDevice').returns(Promise.resolve(true))
    sandbox.stub(SpotifyService.prototype, 'addSongToPlaylist').returns(Promise.resolve(true))
    sandbox.stub(SpotifyService.prototype, 'removeSongFromPlaylist').returns(Promise.resolve(true))
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
      expect(error.message).to.equal('Playlist with id 1133 does not exists!')
    }
  })

  it('should playOnDevice', async () => {
    const usersService = new UsersService(testsUtil.session)
    const juan = await usersService.loadByEmail('juan@gmail.com')
    const playlistService = new PlaylistsService(testsUtil.session)
    const playlists = await playlistService.loadAll()
    const playlist1 = playlists[0]
    const response = await playlistService.playOnDevice(juan, playlist1.id, '4455')
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
    expect(songsSpotifyIds).to.deep.equal(['1144', '1133', '1155'])
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
    expect(songsSpotifyIds).to.deep.equal(['1144', '4433', '1155'])
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

  it('should load all playlist active songs by genreId', async () => {
    const playlistService = new PlaylistsService(testsUtil.session)
    const genresService = new GenresService(testsUtil.session)
    const allGenres = await genresService.loadAll({ orderBy: 'order' })
    const heavyMetalGenre = allGenres[0]
    const playlistSongs = await playlistService.loadAllPlaylistActiveSongsByGenre(
      heavyMetalGenre.id,
    )
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

  it('should not add song to playlist if the song is present and active in the playlist', async () => {
    try {
      const usersService = new UsersService(testsUtil.session)
      const jose = await usersService.loadByEmail('jose.morales@gmail.com')
      const playlistService = new PlaylistsService(testsUtil.session)
      const allPlaylists = await playlistService.loadAll()
      const playlist1 = allPlaylists[0]
      await playlistService.addSongToPlaylist(jose.id, playlist1.id, testSong2)
    } catch (error) {
      expect(error.message).to.equal(
        'Song Hallowed Be Thy Name by Iron Maiden is already in this playlist',
      )
    }
  })

  it('should add a song to playlist -> non existing song in db', async () => {
    const usersService = new UsersService(testsUtil.session)
    const jose = await usersService.loadByEmail('jose.morales@gmail.com')
    const playlistService = new PlaylistsService(testsUtil.session)
    let allPlaylists = await playlistService.loadAll()
    let playlist1 = allPlaylists[0]
    const playlistSong = await playlistService.addSongToPlaylist(jose.id, playlist1.id, testSong1)
    expect(playlistSong).to.containSubset(expectedAddSong1)

    allPlaylists = await playlistService.loadAll()
    playlist1 = allPlaylists[0]
    const activePlaylistSongs = await playlistService.loadAllPlaylistActiveSongs(playlist1.id)
    const spotifyIds = activePlaylistSongs.map((playlistSong) => playlistSong.song.spotifyId)
    expect(spotifyIds).to.deep.equal(['ava11', '1155', '4433', '1133', '1144'])
  })

  it('should add a song to playlist -> existing song in db', async () => {
    const usersService = new UsersService(testsUtil.session)
    const san = await usersService.loadByEmail('sandra.aguilar@gmail.com')
    const playlistService = new PlaylistsService(testsUtil.session)
    let allPlaylists = await playlistService.loadAll()
    let playlist1 = allPlaylists[0]
    const playlistSong = await playlistService.addSongToPlaylist(san.id, playlist1.id, testSong3)
    expect(playlistSong).to.containSubset(expectedAddSong2)

    allPlaylists = await playlistService.loadAll()
    playlist1 = allPlaylists[0]
    const activePlaylistSongs = await playlistService.loadAllPlaylistActiveSongs(playlist1.id)
    const spotifyIds = activePlaylistSongs.map((playlistSong) => playlistSong.song.spotifyId)
    expect(spotifyIds).to.deep.equal(['5533', '1155', '4433', '1133', '1144'])
  })

  it('should add a song to a playlist -> max songs per playlist reached (should remove oldest and add new song)', async () => {
    const usersService = new UsersService(testsUtil.session)
    const jose = await usersService.loadByEmail('jose.morales@gmail.com')
    const playlistService = new PlaylistsService(testsUtil.session)
    let allPlaylists = await playlistService.loadAll()
    let playlist1 = allPlaylists[0]
    await playlistService.addSongToPlaylist(jose.id, playlist1.id, testSong1)

    allPlaylists = await playlistService.loadAll()
    playlist1 = allPlaylists[0]
    let allPlaylistSongs = await playlistService.loadAllPlaylistActiveSongs(playlist1.id)
    let spotifyIds = allPlaylistSongs.map((playlistSong) => playlistSong.song.spotifyId)
    expect(spotifyIds).to.deep.equal(['ava11', '1155', '4433', '1133', '1144'])

    const playlistSong = await playlistService.addSongToPlaylist(jose.id, playlist1.id, testSong4)
    expect(playlistSong).to.containSubset(expectedAddSong3)

    allPlaylistSongs = await playlistService.loadAllPlaylistActiveSongs(playlist1.id)
    spotifyIds = allPlaylistSongs.map((playlistSong) => playlistSong.song.spotifyId)
    expect(spotifyIds).to.deep.equal(['warcry11', 'ava11', '1155', '4433', '1133'])
  })

  it('it should search songs', async () => {
    const playlistService = new PlaylistsService(testsUtil.session)
    const playlists = await playlistService.loadAll()
    const playlist1 = playlists[0]
    const searchSongs = await playlistService.searchSongs(playlist1.id, 'iron maiden')
    expect(searchSongs).to.containSubset(expectedSearchSongs)
  })
})
