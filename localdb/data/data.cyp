// First we clean up the database
MATCH (n) DETACH DELETE n;
// USERS
CREATE (:User { firstname:'Juan', lastname: 'Morales', email: 'juan.morales@gmail.com' })
CREATE (:User { firstname:'Pablo', lastname: 'Gonzalez', email: 'pablo.gonzalez@gmail.com' })
// GENRES & PLAYLISTS
CREATE (blues:Genre { name:'Blues', order:1, maxSongs:200 })
CREATE (bluesPlaylist:Playlist { name: 'One day Radio. Blues playlist', description: 'This playlist has been created for you by the community. One day Radio. Blues playlist', genreId: ID(blues), spotifyId: '0Np5XNyiRJE5RQHRJjXKRZ' })
CREATE (blues)-[:HAS_PLAYLIST]->(bluesPlaylist)

CREATE (chill:Genre { name: 'Chill', order: 2, maxSongs: 200 })
CREATE (chillPlaylist:Playlist { name: 'One day Radio. Chill playlist', description: 'This playlist has been created for you by the community. One day Radio. Chill playlist', genreId: ID(chill), spotifyId: '0esjbe8oJjT73bRWIqlZSU' })
CREATE (chill)-[:HAS_PLAYLIST]->(chillPlaylist)

CREATE (classical:Genre { name: 'Classical', order: 3, maxSongs: 200 })
CREATE (classicalPlaylist:Playlist { name: 'One day Radio. Classical playlist', description: 'This playlist has been created for you by the community. One day Radio. Classical playlist', genreId: ID(classical), spotifyId: '5Mh9hPLwWy0HoIvUn2aqM9' })
CREATE (classical)-[:HAS_PLAYLIST]->(classicalPlaylist)

CREATE (country:Genre { name: 'Country', order: 4, maxSongs: 200 })
CREATE (countryPlaylist:Playlist { name: 'One day Radio. Country playlist', description: 'This playlist has been created for you by the community. One day Radio. Country playlist', genreId: ID(country), spotifyId: '5yl8fVwFyIp1Vj19uphS7d' })
CREATE (country)-[:HAS_PLAYLIST]->(countryPlaylist)

CREATE (electronic:Genre { name: 'Electronic', order: 5, maxSongs: 200 })
CREATE (electronicPlaylist:Playlist { name: 'One day Radio. Electronic playlist', description: 'This playlist has been created for you by the community. One day Radio. Electronic playlist', genreId: ID(electronic), spotifyId: '6TI982RbnUXqv7GCHr6cAx' })
CREATE (electronic)-[:HAS_PLAYLIST]->(electronicPlaylist)

CREATE (funk:Genre { name: 'Funk', order: 6, maxSongs: 200 })
CREATE (funkPlaylist:Playlist { name: 'One day Radio. Funk playlist', description: 'This playlist has been created for you by the community. One day Radio. Funk playlist', genreId: ID(funk), spotifyId: '7DEGd8FyxeA3yEl2MPvEg7' })
CREATE (funk)-[:HAS_PLAYLIST]->(funkPlaylist)

CREATE (hiphop:Genre { name: 'Hip Hop', order: 7, maxSongs: 200 })
CREATE (hiphopPlaylist:Playlist { name: 'One day Radio. Hip Hop playlist', description: 'This playlist has been created for you by the community. One day Radio. Hip Hop playlist', genreId: ID(hiphop), spotifyId: '6HswfLHtPYUaAj7JD9HEIK' })
CREATE (hiphop)-[:HAS_PLAYLIST]->(hiphopPlaylist)

CREATE (indie:Genre { name: 'Indie', order: 8, maxSongs: 200 })
CREATE (indiePlaylist:Playlist { name: 'One day Radio. Indie playlist', description: 'This playlist has been created for you by the community. One day Radio. Indie playlist', genreId: ID(indie), spotifyId: '56WyFyn0ZROlAO434bE24v' })
CREATE (indie)-[:HAS_PLAYLIST]->(indiePlaylist)

CREATE (jazz:Genre { name: 'Jazz', order: 9, maxSongs: 200 })
CREATE (jazzPlaylist:Playlist { name: 'One day Radio. Jazz playlist', description: 'This playlist has been created for you by the community. One day Radio. Jazz playlist', genreId: ID(jazz), spotifyId: '1a4lmrvTvNMV2fWB460JJX' })
CREATE (jazz)-[:HAS_PLAYLIST]->(jazzPlaylist)

CREATE (latin:Genre { name: 'Latin', order: 10, maxSongs: 200 })
CREATE (latinPlaylist:Playlist { name: 'One day Radio. Latin playlist', description: 'This playlist has been created for you by the community. One day Radio. Latin playlist', genreId: ID(latin), spotifyId: '11P5yrfWAIG7ojkuGOzyZm' })
CREATE (latin)-[:HAS_PLAYLIST]->(latinPlaylist)

CREATE (heavyMetal:Genre { name: 'Heavy Metal', order: 11, maxSongs: 200 })
CREATE (heavyMetalPlaylist:Playlist { name: 'One day Radio. Heavy Metal playlist', description: 'This playlist has been created for you by the community. One day Radio. Heavy Metal playlist', genreId: ID(heavyMetal), spotifyId: '2x3yu5txW2IpqH9AihnHcS' })
CREATE (heavyMetal)-[:HAS_PLAYLIST]->(heavyMetalPlaylist)

CREATE (pop:Genre { name: 'Pop', order: 12, maxSongs: 200 })
CREATE (popPlaylist:Playlist { name: 'One day Radio. Pop playlist', description: 'This playlist has been created for you by the community. One day Radio. Pop playlist', genreId: ID(pop), spotifyId: '48g1jWlR7e6eM3QEMQcFVq' })
CREATE (pop)-[:HAS_PLAYLIST]->(popPlaylist)

CREATE (punk:Genre { name: 'Punk', order: 13, maxSongs: 200 })
CREATE (punkPlaylist:Playlist { name: 'One day Radio. Punk playlist', description: 'This playlist has been created for you by the community. One day Radio. Punk playlist', genreId: ID(punk), spotifyId: '5zTpB68MEk6F8nRNkPS2ek' })
CREATE (punk)-[:HAS_PLAYLIST]->(punkPlaylist)

CREATE (ryb:Genre { name: 'R&B', order: 14, maxSongs: 200 })
CREATE (rybPlaylist:Playlist { name: 'One day Radio. R&B playlist', description: 'This playlist has been created for you by the community. One day Radio. R&B playlist', genreId: ID(ryb), spotifyId: '7KlsYo1biWhOEw5bqhJB51' })
CREATE (ryb)-[:HAS_PLAYLIST]->(rybPlaylist)

CREATE (reggae:Genre { name: 'Reggae', order: 15, maxSongs: 200 })
CREATE (reggaePlaylist:Playlist { name: 'One day Radio. Reggae playlist', description: 'This playlist has been created for you by the community. One day Radio. Reggae playlist', genreId: ID(reggae), spotifyId: '1epjKELZ0QNSZqQcSaSvAX' })
CREATE (reggae)-[:HAS_PLAYLIST]->(reggaePlaylist)

CREATE (spanishRock:Genre { name: 'Rock en Español', order: 16, maxSongs: 200 })
CREATE (spanishRockPlaylist:Playlist { name: 'One day Radio. Rock en Español playlist', description: 'This playlist has been created for you by the community. One day Radio. Rock en Español playlist', genreId: ID(spanishRock), spotifyId: '2hKJnecMuebytIt0ryDkMT' })
CREATE (spanishRock)-[:HAS_PLAYLIST]->(spanishRockPlaylist)

CREATE (rock:Genre { name: 'Rock', order: 17, maxSongs: 200 })
CREATE (rockPlaylist:Playlist { name: 'One day Radio. Rock playlist', description: 'This playlist has been created for you by the community. One day Radio. Rock playlist', genreId: ID(rock), spotifyId: '4bUKf446jDc5jRlpKp0Xz9' })
CREATE (rock)-[:HAS_PLAYLIST]->(rockPlaylist)

CREATE (romance:Genre { name: 'Romance', order: 18, maxSongs: 200 })
CREATE (romancePlaylist:Playlist { name: 'One day Radio. Romance playlist', description: 'This playlist has been created for you by the community. One day Radio. Romance playlist', genreId: ID(romance), spotifyId: '4tandKUfWJ512KCmo8tCNo' })
CREATE (romance)-[:HAS_PLAYLIST]->(romancePlaylist)

CREATE (soul:Genre { name: 'Soul', order: 19, maxSongs: 200 })
CREATE (soulPlaylist:Playlist { name: 'One day Radio. Soul playlist', description: 'This playlist has been created for you by the community. One day Radio. Soul playlist', genreId: ID(soul), spotifyId: '6EPXMsvFMDBoYaiyxBq2Z9' })
CREATE (soul)-[:HAS_PLAYLIST]->(soulPlaylist)
;
