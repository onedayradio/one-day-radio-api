export const spotifyServiceSearchSongs = {
  href: 'some-url',
  items: [
    {
      artists: [{ id: '11', name: 'Judas Priest' }],
      duration_ms: 358706,
      explicit: false,
      id: '2QagWuAL61R8DLydEte3tw',
      name: 'Raw Deal',
      popularity: 29,
      uri: 'some-uri',
      album: {
        id: '2GXeHOkRouW0LnKBMUnVtv',
        name: 'Sin After Sin',
        images: [{ width: 600, height: 400, url: 'http://image-url' }],
      },
    },
    {
      artists: [{ id: '33', name: 'Dj Suchensuch' }],
      duration_ms: 362042,
      explicit: true,
      id: '16wkyNymAE6ruWAZcUx871',
      name: 'Raw Deal',
      popularity: 18,
      uri: 'some-uri',
      album: {
        id: '7K5tf5FJ4bpmq5MABQqKsW',
        name: 'District',
        images: [{ width: 600, height: 400, url: 'http://image-url' }],
      },
    },
  ],
  songs: [
    {
      spotifyId: '2QagWuAL61R8DLydEte3tw',
      name: 'Raw Deal',
      artistSpotifyIds: '11',
      artistsNames: 'Judas Priest',
      spotifyUri: 'some-uri',
      albumName: 'Sin After Sin',
      albumSpotifyId: '2GXeHOkRouW0LnKBMUnVtv',
      albumImage300: '',
    },
    {
      spotifyId: '16wkyNymAE6ruWAZcUx871',
      name: 'Raw Deal',
      artistSpotifyIds: '33',
      artistsNames: 'Dj Suchensuch',
      spotifyUri: 'some-uri',
      albumName: 'District',
      albumSpotifyId: '7K5tf5FJ4bpmq5MABQqKsW',
      albumImage300: '',
    },
  ],
}

export const expectedSpotifyPlaylistItems = {
  href: 'https://api.spotify.com/v1/playlists/08zCBxKpTDyQU3hP7cusMx/tracks?offset=1&limit=1',
  items: [
    {
      added_at: '2020-07-01T03:41:15Z',
      added_by: {
        external_urls: {},
        href: 'https://api.spotify.com/v1/users/nrg9c2eetq2ttxeyt0vdedrbx',
        id: 'nrg9c2eetq2ttxeyt0vdedrbx',
        type: 'user',
        uri: 'spotify:user:nrg9c2eetq2ttxeyt0vdedrbx',
      },
      is_local: false,
      primary_color: null,
      track: {
        album: { id: '', name: '', images: [{ width: 0, height: 0, url: '' }] },
        artists: [
          {
            external_urls: {},
            href: 'https://api.spotify.com/v1/artists/14pVkFUHDL207LzLHtSA18',
            id: '14pVkFUHDL207LzLHtSA18',
            name: 'Iron Maiden',
            type: 'artist',
            uri: 'spotify:artist:14pVkFUHDL207LzLHtSA18',
          },
        ],
        available_markets: ['AD'],
        disc_number: 1,
        duration_ms: 315120,
        episode: false,
        explicit: true,
        external_ids: { isrc: 'USEE10170088' },
        external_urls: { spotify: 'https://open.spotify.com/album/7kW0cpKgSVsEqcc8xgbSb0' },
        href: 'https://api.spotify.com/v1/tracks/7fcfNW0XxTWlwVlftzfDOR',
        id: '1SpuDZ7y1W4vaCzHeLvsf7',
        is_local: false,
        name: 'Wrathchild - 2015 Remaster',
        popularity: 73,
        preview_url:
          'https://p.scdn.co/mp3-preview/14e66cb261d6027f14d31e7d247b2281b9e79e71?cid=e43b1585ddf145c0b06a60b4dbe03f66',
        track: true,
        track_number: 3,
        type: 'track',
        uri: 'spotify:track:7fcfNW0XxTWlwVlftzfDOR',
      },
      video_thumbnail: { url: null },
    },
  ],
  limit: 1,
  next: '',
  offset: 1,
  previous: 'https://api.spotify.com/v1/playlists/08zCBxKpTDyQU3hP7cusMx/tracks?offset=0&limit=1',
  total: 2,
  songs: [
    {
      spotifyId: '1SpuDZ7y1W4vaCzHeLvsf7',
      name: 'Wrathchild - 2015 Remaster',
      artistSpotifyIds: '14pVkFUHDL207LzLHtSA18',
      artistsNames: 'Iron Maiden',
      spotifyUri: 'spotify:track:7fcfNW0XxTWlwVlftzfDOR',
      albumName: '',
      albumSpotifyId: '',
      albumImage300: '',
    },
  ],
}

export const expectedSpotifySearchSongs = {
  href: 'some-url',
  items: [
    {
      artists: [{ id: '11', name: 'Judas Priest' }],
      ['duration_ms']: 358706,
      explicit: false,
      id: '2QagWuAL61R8DLydEte3tw',
      name: 'Raw Deal',
      popularity: 29,
      uri: 'some-uri',
      album: {
        id: '2GXeHOkRouW0LnKBMUnVtv',
        name: 'Sin After Sin',
        images: [{ width: 600, height: 400, url: 'http://image-url' }],
      },
    },
    {
      artists: [{ id: '33', name: 'Dj Suchensuch' }],
      ['duration_ms']: 362042,
      explicit: true,
      id: '16wkyNymAE6ruWAZcUx871',
      name: 'Raw Deal',
      popularity: 18,
      uri: 'some-uri',
      album: {
        id: '7K5tf5FJ4bpmq5MABQqKsW',
        name: 'District',
        images: [{ width: 600, height: 400, url: 'http://image-url' }],
      },
    },
  ],
}
