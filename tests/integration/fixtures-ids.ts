// eslint-disable-next-line
const ObjectId = require('mongodb').ObjectID

const ids = {
  users: {
    juanId: ObjectId(),
    pabloId: ObjectId(),
    sanId: ObjectId(),
    joseId: ObjectId(),
  },
  genres: {
    metalId: ObjectId(),
    rockId: ObjectId(),
    punkId: ObjectId(),
    popId: ObjectId(),
  },
  playlist: {
    metalId: ObjectId(),
    rockId: ObjectId(),
    popId: ObjectId(),
    todayId: ObjectId(),
    yesterdayId: ObjectId(),
  },
  playlistSongs: {
    metalWrathchildId: ObjectId(),
    metalTheTrooperId: ObjectId(),
    metalRawDealId: ObjectId(),
    rockPushingMeAway: ObjectId(),
    rockSomewhereIBelong: ObjectId(),
    rockFaint: ObjectId(),
    rockBleedItOut: ObjectId(),
    rockOneMoreLight: ObjectId(),
    rockTheMessenger: ObjectId(),
    popBillieJean: ObjectId(),
    popSmoothCriminal: ObjectId(),
  },
  devices: {
    echoDot: ObjectId(),
    mac: ObjectId(),
  },
}

export { ids }
