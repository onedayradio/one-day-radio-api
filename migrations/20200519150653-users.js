module.exports = {
  async up(db, client) {
    await db
      .collection('users')
      .insertOne({ firstname: 'Juan', lastname: 'Morales', email: 'juan.morales@gmail.com' })
    await db
      .collection('users')
      .insertOne({ firstname: 'Pablo', lastname: 'Gonzalez', email: 'pablo.gonzalez@gmail.com' })
  },

  async down(db, client) {
    await db.collection('users').deleteOne({ firstname: 'Juan' })
    await db.collection('users').deleteOne({ firstname: 'Pablo' })
  },
}
