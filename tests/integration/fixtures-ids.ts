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
  },
  playList: {
    todayId: ObjectId(),
    yesterdayId: ObjectId(),
  },
}

export { ids }
