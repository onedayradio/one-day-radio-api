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

export const playListMock = {
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
