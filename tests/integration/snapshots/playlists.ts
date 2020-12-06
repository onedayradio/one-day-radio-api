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

export const expectedAddSong3 = {
  song: {
    artistsNames: 'Warcry',
    name: 'La Vida en un Beso',
    spotifyUri: 'http://a-spotify-song-uri.com',
    albumImage300: 'http://some300image',
    artistSpotifyIds: 'warcrysong1133',
    albumName: 'Revolucion',
    spotifyId: 'warcry11',
    albumSpotifyId: 'warcryalbum11',
  },
  sharedBy: {
    lastname: 'Morales',
    firstname: 'Jose',
    email: 'jose.morales@gmail.com',
  },
  active: true,
}

export const expectedSearchSongs = [
  {
    song: {
      spotifyId: '1133',
      name: 'Hallowed Be Thy Name',
      artistSpotifyIds: 'im11',
      artistsNames: 'Iron Maiden',
      spotifyUri: 'some-uri',
      albumName: 'The Number of the Beast',
      albumSpotifyId: 'imalbum11',
      albumImage300: 'http://image-url',
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
      spotifyId: '2233',
      name: 'Stop',
      artistSpotifyIds: 'da11',
      artistsNames: 'Death Angel',
      spotifyUri: 'some-uri',
      albumName: 'The Art of Dying',
      albumSpotifyId: 'daalbum11',
      albumImage300: 'http://image-url',
    },
    sharedBy: undefined,
    sharedOn: undefined,
    active: false,
  },
  {
    song: {
      spotifyId: '16wkyNymAE6ruWAZcUx871',
      name: 'Raw Deal',
      artistSpotifyIds: '33',
      artistsNames: 'Dj Suchensuch',
      spotifyUri: 'some-uri',
      albumName: 'District',
      albumSpotifyId: '7K5tf5FJ4bpmq5MABQqKsW',
      albumImage300: '',
    },
    sharedBy: undefined,
    sharedOn: undefined,
    active: false,
  },
]
