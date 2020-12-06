// First we clean up the database
MATCH (n) DETACH DELETE n;
// USERS
CREATE (:User { firstname:'Juan', lastname: 'Morales', email: 'juan.morales@gmail.com' })
CREATE (:User { firstname:'Pablo', lastname: 'Gonzalez', email: 'pablo.gonzalez@gmail.com' })
// GENRES
CREATE (:Genre { name:'Blues', order:1, maxSongs:200 })
CREATE (:Genre { name: 'Chill', order: 2, maxSongs: 200 })
CREATE (:Genre { name: 'Classical', order: 3, maxSongs: 200 })
CREATE (:Genre { name: 'Country', order: 4, maxSongs: 200 })
CREATE (:Genre { name: 'Electronic', order: 5, maxSongs: 200 })
CREATE (:Genre { name: 'Funk', order: 6, maxSongs: 200 })
CREATE (:Genre { name: 'Hip Hop', order: 7, maxSongs: 200 })
CREATE (:Genre { name: 'Indie', order: 8, maxSongs: 200 })
CREATE (:Genre { name: 'Jazz', order: 9, maxSongs: 200 })
CREATE (:Genre { name: 'Latin', order: 10, maxSongs: 200 })
CREATE (:Genre { name: 'Heavy Metal', order: 11, maxSongs: 200 })
CREATE (:Genre { name: 'Pop', order: 12, maxSongs: 200 })
CREATE (:Genre { name: 'Punk', order: 13, maxSongs: 200 })
CREATE (:Genre { name: 'R&B', order: 14, maxSongs: 200 })
CREATE (:Genre { name: 'Reggae', order: 15, maxSongs: 200 })
CREATE (:Genre { name: 'Rock en Español', order: 16, maxSongs: 200 })
CREATE (:Genre { name: 'Rock', order: 17, maxSongs: 200 })
CREATE (:Genre { name: 'Romance', order: 18, maxSongs: 200 })
CREATE (:Genre { name: 'Soul', order: 19, maxSongs: 200 })
;
