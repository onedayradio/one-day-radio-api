// First we clean up the database
MATCH (n) DETACH DELETE n;
// USERS
CREATE (:User { firstname:'Juan', lastname: 'Morales', email: 'juan.morales@gmail.com' })
CREATE (:User { firstname:'Pablo', lastname: 'Gonzalez', email: 'pablo.gonzalez@gmail.com' })
// GENRES & PLAYLISTS
CREATE (blues:Genre { name:'Blues', order:1, maxSongs:200 })
CREATE (:Playlist { name: 'One day Radio. Blues playlist', description: 'This playlist has been created for you by the community. One day Radio. Blues playlist', genreId: ID(blues), spotifyId: '0exXppqE1XvIFPYuNLgVRm' })

CREATE (chill:Genre { name: 'Chill', order: 2, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Chill playlist', description: 'This playlist has been created for you by the community. One day Radio. Chill playlist', genreId: ID(chill), spotifyId: '2Npnm7DydgyVmyAtjqUnfH' })

CREATE (classical:Genre { name: 'Classical', order: 3, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Classical playlist', description: 'This playlist has been created for you by the community. One day Radio. Classical playlist', genreId: ID(classical), spotifyId: '4mqTkNs9cXkV4awN9gLC9N' })

CREATE (country:Genre { name: 'Country', order: 4, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Country playlist', description: 'This playlist has been created for you by the community. One day Radio. Country playlist', genreId: ID(country), spotifyId: '3rz7NUSb8vKpwXKp9gacz7' })

CREATE (electronic:Genre { name: 'Electronic', order: 5, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Electronic playlist', description: 'This playlist has been created for you by the community. One day Radio. Electronic playlist', genreId: ID(electronic), spotifyId: '5HzMWDwXwHz1UgVruE5oH4' })

CREATE (funk:Genre { name: 'Funk', order: 6, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Funk playlist', description: 'This playlist has been created for you by the community. One day Radio. Funk playlist', genreId: ID(funk), spotifyId: '7aFI70jB8VmRD7RwViLnAW' })

CREATE (hiphop:Genre { name: 'Hip Hop', order: 7, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Hip Hop playlist', description: 'This playlist has been created for you by the community. One day Radio. Hip Hop playlist', genreId: ID(hiphop), spotifyId: '4CsylMFfBIUL4tEAcjYI3A' })

CREATE (indie:Genre { name: 'Indie', order: 8, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Indie playlist', description: 'This playlist has been created for you by the community. One day Radio. Indie playlist', genreId: ID(indie), spotifyId: '4ZQ0CkdBXddkfNBfOgDFVF' })

CREATE (jazz:Genre { name: 'Jazz', order: 9, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Jazz playlist', description: 'This playlist has been created for you by the community. One day Radio. Jazz playlist', genreId: ID(jazz), spotifyId: '2fHneO4ow2L4Vqj1WhrKN9' })

CREATE (latin:Genre { name: 'Latin', order: 10, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Latin playlist', description: 'This playlist has been created for you by the community. One day Radio. Latin playlist', genreId: ID(latin), spotifyId: '1N9FJ6EX69qpM61Tl0ODTN' })

CREATE (heavyMetal:Genre { name: 'Heavy Metal', order: 11, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Heavy Metal playlist', description: 'This playlist has been created for you by the community. One day Radio. Heavy Metal playlist', genreId: ID(heavyMetal), spotifyId: '4F6vnmYYfydgcDb310wRkk' })

CREATE (pop:Genre { name: 'Pop', order: 12, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Pop playlist', description: 'This playlist has been created for you by the community. One day Radio. Pop playlist', genreId: ID(pop), spotifyId: '094D2Dt3i8uu5ZCh3iW3A3' })

CREATE (punk:Genre { name: 'Punk', order: 13, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Punk playlist', description: 'This playlist has been created for you by the community. One day Radio. Punk playlist', genreId: ID(punk), spotifyId: '1T480qHu7V1xIbFRRZGYAq' })

CREATE (ryb:Genre { name: 'R&B', order: 14, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. R&B playlist', description: 'This playlist has been created for you by the community. One day Radio. R&B playlist', genreId: ID(ryb), spotifyId: '1eeLcBXxiRrHubqtSVxEK2' })

CREATE (reggae:Genre { name: 'Reggae', order: 15, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Reggae playlist', description: 'This playlist has been created for you by the community. One day Radio. Reggae playlist', genreId: ID(reggae), spotifyId: '28fgTlXtuzAPk2EnzwDqZJ' })

CREATE (spanishRock:Genre { name: 'Rock en Español', order: 16, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Rock en Español playlist', description: 'This playlist has been created for you by the community. One day Radio. Rock en Español playlist', genreId: ID(spanishRock), spotifyId: '4gC85pSp7qsuhViaaS5DDI' })

CREATE (rock:Genre { name: 'Rock', order: 17, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Rock playlist', description: 'This playlist has been created for you by the community. One day Radio. Rock playlist', genreId: ID(rock), spotifyId: '49gaG9vOn3RHL1gTJuh2RP' })

CREATE (romance:Genre { name: 'Romance', order: 18, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Romance playlist', description: 'This playlist has been created for you by the community. One day Radio. Romance playlist', genreId: ID(romance), spotifyId: '0c91aHNU9CiJPP3s7v8M2d' })

CREATE (soul:Genre { name: 'Soul', order: 19, maxSongs: 200 })
CREATE (:Playlist { name: 'One day Radio. Soul playlist', description: 'This playlist has been created for you by the community. One day Radio. Soul playlist', genreId: ID(soul), spotifyId: '7Dun7STHf2hTyyO3UgKjru' })
;
