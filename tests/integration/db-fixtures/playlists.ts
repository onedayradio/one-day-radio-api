import { ids } from '../fixtures-ids'

module.exports = [
  {
    _id: ids.playlist.metalId,
    spotifyId: '33',
    name: 'One day Radio. Heavy Metal playlist - 2020-06-14',
    description: 'This playlist has some songs added to it',
    genreId: ids.genres.metalId,
  },
  {
    _id: ids.playlist.rockId,
    spotifyId: '44',
    name: 'One day Radio. Rock playlist - 2020-06-14',
    description: 'This playlist has 6 songs added to it',
    genreId: ids.genres.rockId,
  },
  {
    _id: ids.playlist.popId,
    spotifyId: '88',
    name: 'One day Radio. Pop playlist - 2020-06-14',
    description: 'This playlist has 2 songs added to it',
    genreId: ids.genres.popId,
  },
]
