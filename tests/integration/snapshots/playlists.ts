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

export const expectedHeavyMetalPlaylist = {
  description:
    'This playlist has been created for you by the community. One day Radio. Heavy Metal playlist',
  spotifyId: '11',
  name: 'One day Radio. Heavy Metal playlist',
}

export const expectedNewPlaylist = {
  name: 'One day Radio. Heavy Metal playlist',
  description:
    'This playlist has been created for you by the community. One day Radio. Heavy Metal playlist',
  spotifyId: '2aflW5TiXgHGSkWSTjNtor',
}

export const expectedPunkPlaylist = {
  name: 'One day Radio. Punk playlist',
  description:
    'This playlist has been created for you by the community. One day Radio. Punk playlist',
  spotifyId: '2aflW5TiXgHGSkWSTjNtor',
}

export const expectedPlaylistsSongsByUser = [
  {
    active: true,
    sharedBy: {
      lastname: 'Morales',
      firstname: 'Juan',
      email: 'juan@gmail.com',
    },
    artists: 'Iron Maiden',
    spotifyUri: 'http://a-spotify-song-uri.com',
    name: 'Hallowed Be Thy Name',
    spotifyId: '1133',
  },
  {
    active: true,
    sharedBy: {
      lastname: 'Morales',
      firstname: 'Juan',
      email: 'juan@gmail.com',
    },
    artists: 'Gamma Ray',
    spotifyUri: 'http://a-spotify-song-uri3.com',
    name: 'From The Ashes',
    spotifyId: '1155',
  },
  {
    active: true,
    sharedBy: {
      lastname: 'Morales',
      firstname: 'Juan',
      email: 'juan@gmail.com',
    },
    artists: 'Iron Maiden',
    spotifyUri: 'http://a-spotify-song-uri2.com',
    name: 'Infinite Dreams',
    spotifyId: '1144',
  },
]

export const expectedSongsBySpotifyIds = [
  {
    song: {
      artistsNames: 'Gamma Ray',
      name: 'From The Ashes',
      spotifyUri: 'http://a-spotify-song-uri3.com',
      albumImage300: 'http://some300image',
      artistSpotifyIds: 'gr11',
      albumName: 'Heading for Tomorrow',
      spotifyId: '1155',
      albumSpotifyId: 'gralbum11',
    },
    sharedBy: {
      lastname: 'Morales',
      firstname: 'Juan',
      email: 'juan@gmail.com',
    },
    active: true,
  },
  {
    song: {
      artistsNames: 'UFO',
      name: 'Love to Love',
      spotifyUri: 'http://a-spotify-song-uri-jose3.com',
      albumImage300: 'http://some300image',
      artistSpotifyIds: 'ufo11',
      albumName: 'Covenant',
      spotifyId: '4433',
      albumSpotifyId: 'ufoalbum11',
    },
    sharedBy: {
      lastname: 'Morales',
      firstname: 'Jose',
      email: 'jose.morales@gmail.com',
    },
    active: true,
  },
  {
    song: {
      artistsNames: 'Iron Maiden',
      name: 'Infinite Dreams',
      spotifyUri: 'http://a-spotify-song-uri2.com',
      albumImage300: 'http://some300image',
      artistSpotifyIds: 'im11',
      albumName: 'Piece of Mind',
      spotifyId: '1144',
      albumSpotifyId: 'imalbum33',
    },
    sharedBy: {
      lastname: 'Morales',
      firstname: 'Juan',
      email: 'juan@gmail.com',
    },
    active: true,
  },
]

export const expectedAllActiveSongs = [
  {
    song: {
      artistsNames: 'Gamma Ray',
      name: 'From The Ashes',
      spotifyUri: 'http://a-spotify-song-uri3.com',
      albumImage300: 'http://some300image',
      artistSpotifyIds: 'gr11',
      albumName: 'Heading for Tomorrow',
      spotifyId: '1155',
      albumSpotifyId: 'gralbum11',
    },
    sharedBy: {
      lastname: 'Morales',
      firstname: 'Juan',
      email: 'juan@gmail.com',
    },
    active: true,
  },
  {
    song: {
      artistsNames: 'UFO',
      name: 'Love to Love',
      spotifyUri: 'http://a-spotify-song-uri-jose3.com',
      albumImage300: 'http://some300image',
      artistSpotifyIds: 'ufo11',
      albumName: 'Covenant',
      spotifyId: '4433',
      albumSpotifyId: 'ufoalbum11',
    },
    sharedBy: {
      lastname: 'Morales',
      firstname: 'Jose',
      email: 'jose.morales@gmail.com',
    },
  },
  {
    song: {
      artistsNames: 'Iron Maiden',
      name: 'Hallowed Be Thy Name',
      spotifyUri: 'http://a-spotify-song-uri.com',
      albumImage300: 'http://some300image',
      artistSpotifyIds: 'im11',
      albumName: 'The Number of the Beast',
      spotifyId: '1133',
      albumSpotifyId: 'imalbum11',
    },
    sharedBy: {
      lastname: 'Morales',
      firstname: 'Juan',
      email: 'juan@gmail.com',
    },
    active: true,
  },
  {
    song: {
      artistsNames: 'Iron Maiden',
      name: 'Infinite Dreams',
      spotifyUri: 'http://a-spotify-song-uri2.com',
      albumImage300: 'http://some300image',
      artistSpotifyIds: 'im11',
      albumName: 'Piece of Mind',
      spotifyId: '1144',
      albumSpotifyId: 'imalbum33',
    },
    sharedBy: {
      lastname: 'Morales',
      firstname: 'Juan',
      email: 'juan@gmail.com',
    },
    active: true,
  },
]

export const expectedRemovedSong = {
  song: {
    artistsNames: 'Iron Maiden',
    name: 'Hallowed Be Thy Name',
    spotifyUri: 'http://a-spotify-song-uri.com',
    albumImage300: 'http://some300image',
    artistSpotifyIds: 'im11',
    albumName: 'The Number of the Beast',
    spotifyId: '1133',
    albumSpotifyId: 'imalbum11',
  },
  active: false,
}

export const expectedAddSong1 = {
  song: {
    artistsNames: 'Avantasia',
    name: 'Unchain the Light',
    spotifyUri: 'http://a-spotify-song-uri.com',
    albumImage300: 'http://some300image',
    artistSpotifyIds: 'avasong1133',
    albumName: 'Ghostlights',
    spotifyId: 'ava11',
    albumSpotifyId: 'avaalbum11',
  },
  sharedBy: {
    lastname: 'Morales',
    firstname: 'Jose',
    email: 'jose.morales@gmail.com',
  },
  active: true,
}

export const expectedAddSong2 = {
  song: {
    artistsNames: 'UFO',
    name: 'Too Hot to Handle',
    spotifyUri: 'http://a-spotify-song-uri-jose4.com',
    albumImage300: 'http://some300image',
    artistSpotifyIds: 'ufo11',
    albumName: 'Covenant',
    spotifyId: '5533',
    albumSpotifyId: 'saalbum11',
  },
  sharedBy: {
    email: 'sandra.aguilar@gmail.com',
    firstname: 'Sandra',
    lastname: 'Aguilar',
  },
  active: true,
}
