export const searchSongsMock = {
  tracks: {
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
  },
  limit: 20,
  next: undefined,
  offset: 0,
  previous: undefined,
  total: 3,
}

export const searchSongsMock2 = {
  href: 'some-url',
  items: [
    {
      artists: [{ id: 'im11', name: 'Iron Maiden' }],
      ['duration_ms']: 358706,
      explicit: false,
      id: '1133',
      name: 'Hallowed Be Thy Name',
      popularity: 29,
      uri: 'some-uri',
      album: {
        id: 'imalbum11',
        name: 'The Number of the Beast',
        images: [{ width: 300, height: 300, url: 'http://image-url' }],
      },
    },
    {
      artists: [{ id: 'da11', name: 'Death Angel' }],
      ['duration_ms']: 358706,
      explicit: false,
      id: '2233',
      name: 'Stop',
      popularity: 29,
      uri: 'some-uri',
      album: {
        id: 'daalbum11',
        name: 'The Art of Dying',
        images: [{ width: 300, height: 300, url: 'http://image-url' }],
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
  limit: 20,
  next: undefined,
  offset: 0,
  previous: undefined,
  total: 3,
}

export const playlistMock = {
  collaborative: false,
  description:
    'This playlist has been created to you, from your community. One day Radio. Rock playlist - 2020-06-02',
  external_urls: {
    spotify: 'https://open.spotify.com/playlist/2aflW5TiXgHGSkWSTjNtor',
  },
  followers: { href: null, total: 0 },
  href: 'https://api.spotify.com/v1/playlists/2aflW5TiXgHGSkWSTjNtor',
  id: '2aflW5TiXgHGSkWSTjNtor',
  images: [],
  name: 'One day Radio. Rock playlist - 2020-06-02',
  owner: {
    display_name: 'OneDayRadio',
    external_urls: [Object],
    href: 'https://api.spotify.com/v1/users/nrg9c2eetq2ttxeyt0vdedrbx',
    id: 'nrg9c2eetq2ttxeyt0vdedrbx',
    type: 'user',
    uri: 'spotify:user:nrg9c2eetq2ttxeyt0vdedrbx',
  },
  primary_color: null,
  public: false,
  snapshot_id: 'MiwyM2I2MDYzZTRiYTNiZTliMmE1OWI3MmIyYzIwYjdiNDIyMWI4Yzlj',
  tracks: {
    href: 'https://api.spotify.com/v1/playlists/2aflW5TiXgHGSkWSTjNtor/tracks?offset=0&limit=100',
    items: [],
    limit: 100,
    next: null,
    offset: 0,
    previous: null,
    total: 0,
  },
  type: 'playlist',
  uri: 'spotify:playlist:2aflW5TiXgHGSkWSTjNtor',
}

export const devicesMock = {
  devices: [
    {
      id: '1db0b3c5-7667-4530-86e6-6cb72ca52789',
      name: 'Echo Dot',
    },
    {
      id: 'b9aa67d4eba084f6e88334f86893da4c2fb554ed',
      name: ' MacBook Pro',
    },
  ],
}

export const playlistItemsMock = {
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
        album: {
          id: '',
          name: '',
          images: [
            {
              width: 0,
              height: 0,
              url: '',
            },
          ],
        },
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
}

export const playlistSongs = {
  songs: [
    {
      id: '1SpuDZ7y1W4vaCzHeLvsf7',
      name: 'Wrathchild - 2015 Remaster',
      artists: 'Iron Maiden',
      uri: 'spotify:track:1SpuDZ7y1W4vaCzHeLvsf7',
      sharedBy: undefined,
      album: {
        id: '',
        name: '',
        images: [
          {
            width: 0,
            height: 0,
            url: '',
          },
        ],
      },
    },
  ],
  total: 2,
  perPage: 10,
  lastPage: 1,
  currentPage: 0,
  from: 0,
  to: 2,
}
