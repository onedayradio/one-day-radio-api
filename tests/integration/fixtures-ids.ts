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
    punkId: ObjectId(),
  },
}

export { ids }
