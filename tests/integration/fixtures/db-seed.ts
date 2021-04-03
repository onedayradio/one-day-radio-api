export const insertAllDataQuery = `
CREATE (Juanca: User {firstname: 'Juan', lastname: 'Morales', email: 'juan@gmail.com', created: datetime() })
CREATE (Pablo: User {firstname: 'Pablo', lastname: 'Gonzalez', email: 'pablo.gonzalez@gmail.com', created: datetime() })
CREATE (San: User {firstname: 'Sandra', lastname: 'Aguilar', email: 'sandra.aguilar@gmail.com', created: datetime() })
CREATE (Jose: User {firstname: 'Jose', lastname: 'Morales', email: 'jose.morales@gmail.com', created: datetime() })
CREATE (SanSpotifyData: SpotifyData{accessToken: 'access-token', refreshToken: 'refresh-token', created: datetime() })
CREATE (JoseSpotifyData: SpotifyData{accessToken: 'jose-access-token', refreshToken: 'jose-refresh-token', created: datetime() })
CREATE
  (San)-[:HAS_SPOTIFY_DATA]->(SanSpotifyData),
  (Jose)-[:HAS_SPOTIFY_DATA]->(JoseSpotifyData)
CREATE (:Genre { name: 'Punk', order: 2, maxSongs: 200, created: datetime() })
CREATE (heavyMetalGenre:Genre { name: 'Heavy Metal', order: 1, maxSongs: 5, created: datetime() })
CREATE (:Genre { name: 'Rock', order: 3, maxSongs: 200, created: datetime() })
CREATE (:Genre { name: 'Pop', order: 4, maxSongs: 200, created: datetime() })
CREATE (playlist1:Playlist { name: 'One day Radio. Heavy Metal playlist', spotifyId: '11', description: 'This playlist has been created for you by the community. One day Radio. Heavy Metal playlist', genreId: ID(heavyMetalGenre), created: datetime() })
CREATE (heavyMetalGenre)-[:HAS_PLAYLIST]->(playlist1)

CREATE (juancaSong1: Song { spotifyId: '1133', spotifyUri: 'http://a-spotify-song-uri.com', name: 'Hallowed Be Thy Name', artistSpotifyIds: 'im11', artistsNames: 'Iron Maiden', albumSpotifyId: 'imalbum11', albumName: 'The Number of the Beast', albumImage300: 'http://some300image' })
CREATE (juancaSong2: Song { spotifyId: '1144', spotifyUri: 'http://a-spotify-song-uri2.com', name: 'Infinite Dreams', artistSpotifyIds: 'im11', artistsNames: 'Iron Maiden', albumSpotifyId: 'imalbum33', albumName: 'Piece of Mind', albumImage300: 'http://some300image' })
CREATE (juancaSong3: Song { spotifyId: '1155', spotifyUri: 'http://a-spotify-song-uri3.com', name: 'From The Ashes', artistSpotifyIds: 'gr11', artistsNames: 'Gamma Ray', albumSpotifyId: 'gralbum11', albumName: 'Heading for Tomorrow', albumImage300: 'http://some300image' })
CREATE (juancaSong4: Song { spotifyId: '1166', spotifyUri: 'http://a-spotify-song-uri4.com', name: 'El Vuelo del Halcon', artistSpotifyIds: 'sa11', artistsNames: 'Saratoga', albumSpotifyId: 'saalbum11', albumName: 'Vientos de Guerra', albumImage300: 'http://some300image' })

CREATE (joseSong1: Song { spotifyId: '2233', spotifyUri: 'http://a-spotify-song-uri-jose1.com', name: 'Stop', artistSpotifyIds: 'da11', artistsNames: 'Death Angel', albumSpotifyId: 'daalbum11', albumName: 'The Art of Dying', albumImage300: 'http://some300image' })
CREATE (joseSong2: Song { spotifyId: '3333', spotifyUri: 'http://a-spotify-song-uri-jose2.com', name: 'Rock Bottom', artistSpotifyIds: 'ufo11', artistsNames: 'UFO', albumSpotifyId: 'ufoalbum11', albumName: 'Covenant', albumImage300: 'http://some300image' })
CREATE (joseSong3: Song { spotifyId: '4433', spotifyUri: 'http://a-spotify-song-uri-jose3.com', name: 'Love to Love', artistSpotifyIds: 'ufo11', artistsNames: 'UFO', albumSpotifyId: 'ufoalbum11', albumName: 'Covenant', albumImage300: 'http://some300image' })
CREATE (joseSong4: Song { spotifyId: '5533', spotifyUri: 'http://a-spotify-song-uri-jose4.com', name: 'Too Hot to Handle', artistSpotifyIds: 'ufo11', artistsNames: 'UFO', albumSpotifyId: 'saalbum11', albumName: 'Covenant', albumImage300: 'http://some300image' })

CREATE (playlist1)-[:HAS_SONG {active: true}]->(juancaSong1)<-[:SHARED_SONG {date: datetime("2020-06-01T18:40:32.142+0100"), active: true}]-(Juanca)
CREATE (playlist1)-[:HAS_SONG {active: true}]->(juancaSong2)<-[:SHARED_SONG {date: datetime("2020-06-01T11:40:32.142+0100"), active: true}]-(Juanca)
CREATE (playlist1)-[:HAS_SONG {active: true}]->(juancaSong3)<-[:SHARED_SONG {date: datetime("2020-07-01T18:41:32.142+0100"), active: true}]-(Juanca)
CREATE (playlist1)-[:HAS_SONG {active: false}]->(juancaSong4)<-[:SHARED_SONG {date: datetime("2020-06-02T18:40:32.142+0100"), active: false}]-(Juanca)
CREATE (playlist1)-[:HAS_SONG {active: false}]->(juancaSong4)<-[:SHARED_SONG {date: datetime("2020-06-03T18:40:32.142+0100"), active: false}]-(Juanca)

CREATE (playlist1)-[:HAS_SONG {active: false}]->(joseSong1)<-[:SHARED_SONG {date: datetime("2020-06-01T18:45:32.142+0100"), active: false}]-(Jose)
CREATE (playlist1)-[:HAS_SONG {active: false}]->(joseSong2)<-[:SHARED_SONG {date: datetime("2020-06-02T18:40:32.142+0100"), active: false}]-(Jose)
CREATE (playlist1)-[:HAS_SONG {active: true}]->(joseSong3)<-[:SHARED_SONG {date: datetime("2020-07-01T18:40:32.142+0100"), active: true}]-(Jose)
CREATE (playlist1)-[:HAS_SONG {active: false}]->(joseSong4)<-[:SHARED_SONG {date: datetime("2020-07-02T18:40:32.142+0100"), active: false}]-(Jose)
WITH Juanca as j
RETURN j
;
`

export const getUserIdsQuery = `
MATCH
(Juanca:User{firstname: 'Juan'}),
(San:User{firstname: 'Sandra'}),
(Pablo:User{firstname: 'Pablo'}),
(Jose:User{firstname: 'Jose'})
RETURN id(Juanca) as juanId, id(San) as sanId, id(Pablo) as pabloId, id(Jose) as joseId
`

export const getAllUsers = `
MATCH (users:User)
OPTIONAL MATCH (users)-[r:HAS_SPOTIFY_DATA]->(spotifyData: SpotifyData)
RETURN users{ .*, id: ID(users), spotifyData: spotifyData{.*} }
`
