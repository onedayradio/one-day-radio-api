module.exports = {
  async up(db, client) {
    await db.collection('genres').insertOne({ name: 'Heavy Metal', order: 1 })
    await db.collection('genres').insertOne({ name: 'Rock', order: 2 })
    await db.collection('genres').insertOne({ name: 'Pop', order: 5 })
    await db.collection('genres').insertOne({ name: 'Salsa', order: 4 })
    await db.collection('genres').insertOne({ name: 'Punk', order: 3 })
  },

  async down(db, client) {
    await db.collection('genres').deleteOne({ name: 'Heavy Metal' })
    await db.collection('genres').deleteOne({ name: 'Rock' })
    await db.collection('genres').deleteOne({ name: 'Pop' })
    await db.collection('genres').deleteOne({ name: 'Salsa' })
    await db.collection('genres').deleteOne({ name: 'Punk' })
  },
}
