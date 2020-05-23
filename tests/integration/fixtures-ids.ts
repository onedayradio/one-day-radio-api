const ObjectId = require('mongodb').ObjectID

const ids = {
  users: {
    juanId: ObjectId(),
    pabloId: ObjectId(),
  },
  genres: {
    metalId: ObjectId(),
    punkId: ObjectId(),
  },
}

export { ids }
