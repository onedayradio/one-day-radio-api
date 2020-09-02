import { ids } from '../fixtures-ids'

export const expectedPlaylistSongs = [
  {
    _id: ids.playlistSongs.metalWrathchildId,
    user: ids.users.juanId,
    playlist: ids.playlist.metalId,
    spotifyId: '1SpuDZ7y1W4vaCzHeLvsf7',
    spotifyUri: 'spotify:track:1SpuDZ7y1W4vaCzHeLvsf7',
    name: 'Wrathchild - 2015 Remaster',
    artists: 'Iron Maiden',
  },
  {
    _id: ids.playlistSongs.metalRawDealId,
    user: ids.users.juanId,
    playlist: ids.playlist.metalId,
    spotifyId: '2QagWuAL61R8DLydEte3tw',
    spotifyUri: 'spotify:track:2QagWuAL61R8DLydEte3tw',
    name: 'Raw Deal',
    artists: 'Judas Priest',
  },
]

export const expectedPlaylistContains = [
  { spotifyId: '1SpuDZ7y1W4vaCzHeLvsf7', duplicate: true },
  { spotifyId: '4OROzZUy6gOWN4UGQVaZMF', duplicate: true },
  { spotifyId: '3hjkzZUy6gOcnu7GQV9311', duplicate: false },
]

export const expectedAddSongToPlaylist = {
  playlist: ids.playlist.metalId,
  user: ids.users.juanId,
  spotifyId: '3311WuAL61R8DLydEt1133',
  spotifyUri: 'spotify:track:3311WuAL61R8DLydEt1133',
  name: 'Ghost Love Score',
  artists: 'Nightwish',
}

export const expectedAddSongToPlaylistEarthSong = {
  playlist: ids.playlist.popId,
  user: {
    _id: ids.users.juanId,
    firstname: 'Juan',
    lastname: 'Morales',
    email: 'juan@gmail.com',
  },
  spotifyId: '2QagWuAL61R8DLydEte344',
  spotifyUri: 'spotify:track:2QagWuAL61R8DLydEte344',
  name: 'Earth Song',
  artists: 'Michael Jackson',
  year: '2020',
  month: '07',
  day: '24',
}
