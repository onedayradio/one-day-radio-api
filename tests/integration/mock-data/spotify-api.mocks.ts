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
