import { ids } from '../fixtures-ids'

module.exports = [
  {
    _id: ids.genres.punkId,
    name: 'Punk',
    order: 2,
  },
  {
    _id: ids.genres.metalId,
    name: 'Heavy Metal',
    order: 1,
    maxSongs: 10,
  },
  {
    _id: ids.genres.rockId,
    name: 'Rock',
    order: 3,
    maxSongs: 2,
  },
  {
    _id: ids.genres.popId,
    name: 'Pop',
    order: 4,
    maxSongs: 2,
  },
]
