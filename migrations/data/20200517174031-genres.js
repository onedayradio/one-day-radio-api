module.exports = {
  async up(db) {
    await db.collection('genres').insertOne({ name: 'Blues', order: 1 })
    await db.collection('genres').insertOne({ name: 'Chill', order: 2 })
    await db.collection('genres').insertOne({ name: 'Classical', order: 3 })
    await db.collection('genres').insertOne({ name: 'Country', order: 4 })
    await db.collection('genres').insertOne({ name: 'Electronic', order: 5 })
    await db.collection('genres').insertOne({ name: 'Funk', order: 6 })
    await db.collection('genres').insertOne({ name: 'Hip Hop', order: 7 })
    await db.collection('genres').insertOne({ name: 'Indie', order: 8 })
    await db.collection('genres').insertOne({ name: 'Jazz', order: 9 })
    await db.collection('genres').insertOne({ name: 'Latin', order: 10 })
    await db.collection('genres').insertOne({ name: 'Heavy Metal', order: 11 })
    await db.collection('genres').insertOne({ name: 'Pop', order: 12 })
    await db.collection('genres').insertOne({ name: 'Punk', order: 13 })
    await db.collection('genres').insertOne({ name: 'R&B', order: 14 })
    await db.collection('genres').insertOne({ name: 'Reggae', order: 15 })
    await db.collection('genres').insertOne({ name: 'Rock en Español', order: 16 })
    await db.collection('genres').insertOne({ name: 'Rock', order: 17 })
    await db.collection('genres').insertOne({ name: 'Romance', order: 18 })
    await db.collection('genres').insertOne({ name: 'Soul', order: 19 })
  },

  async down(db) {
    await db.collection('genres').remove({})
  },
}
