import { ids } from '../fixtures-ids'

module.exports = [
  {
    _id: ids.playList.yesterdayId,
    spotifyId: '11',
    name: 'One day Radio. Rock playlist - 2020-06-02',
    description:
      'This playlist has been created to you, from your community. One day Radio. Rock playlist - 2020-06-02',
  },
  {
    _id: ids.playList.metalId,
    spotifyId: '33',
    name: 'One day Radio. Heavy Metal playlist - 2020-06-14',
    description: 'This playlist has some songs added to it',
    genreId: ids.genres.metalId,
  },
  {
    _id: ids.playList.rockId,
    spotifyId: '44',
    name: 'One day Radio. Rock playlist - 2020-06-14',
    description: 'This playlist has 6 songs added to it',
    genreId: ids.genres.rockId,
  },
  {
    _id: ids.playList.popId,
    spotifyId: '88',
    name: 'One day Radio. Pop playlist - 2020-06-14',
    description: 'This playlist has 2 songs added to it',
    genreId: ids.genres.popId,
  },
]
