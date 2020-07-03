module.exports = {
  async up(db) {
    await db.collection('genres').insertOne({ name: 'Blues', order: 1, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Chill', order: 2, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Classical', order: 3, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Country', order: 4, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Electronic', order: 5, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Funk', order: 6, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Hip Hop', order: 7, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Indie', order: 8, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Jazz', order: 9, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Latin', order: 10, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Heavy Metal', order: 11, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Pop', order: 12, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Punk', order: 13, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'R&B', order: 14, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Reggae', order: 15, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Rock en Español', order: 16, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Rock', order: 17, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Romance', order: 18, maxSongs: 200 })
    await db.collection('genres').insertOne({ name: 'Soul', order: 19, maxSongs: 200 })
  },

  async down(db) {
    await db.collection('genres').remove({})
  },
}
