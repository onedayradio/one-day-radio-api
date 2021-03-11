import { Session } from 'neo4j-driver'
import { camelCase } from 'lodash'
import fs from 'fs'

import { PlaylistsService, SpotifyService } from '../src/components'
import { Genre } from '../src/types'

const spotifyPlaylistsIds = {
  Blues: '0exXppqE1XvIFPYuNLgVRm',
  Chill: '2Npnm7DydgyVmyAtjqUnfH',
  Classical: '4mqTkNs9cXkV4awN9gLC9N',
  Country: '3rz7NUSb8vKpwXKp9gacz7',
  Electronic: '5HzMWDwXwHz1UgVruE5oH4',
  Funk: '7aFI70jB8VmRD7RwViLnAW',
  'Heavy Metal': '4F6vnmYYfydgcDb310wRkk',
  'Hip Hop': '4CsylMFfBIUL4tEAcjYI3A',
  Indie: '4ZQ0CkdBXddkfNBfOgDFVF',
  Jazz: '2fHneO4ow2L4Vqj1WhrKN9',
  Latin: '1N9FJ6EX69qpM61Tl0ODTN',
  Pop: '094D2Dt3i8uu5ZCh3iW3A3',
  Punk: '1T480qHu7V1xIbFRRZGYAq',
  'R&B': '1eeLcBXxiRrHubqtSVxEK2',
  Reggae: '28fgTlXtuzAPk2EnzwDqZJ',
  Rock: '49gaG9vOn3RHL1gTJuh2RP',
  'Rock en Español': '4gC85pSp7qsuhViaaS5DDI',
  Romance: '0c91aHNU9CiJPP3s7v8M2d',
  Soul: '7Dun7STHf2hTyyO3UgKjru',
}

const spotifyTestEnvPlaylistIds = {
  Blues: '0Np5XNyiRJE5RQHRJjXKRZ',
  Chill: '0esjbe8oJjT73bRWIqlZSU',
  Classical: '5Mh9hPLwWy0HoIvUn2aqM9',
  Country: '5yl8fVwFyIp1Vj19uphS7d',
  Electronic: '6TI982RbnUXqv7GCHr6cAx',
  Funk: '7DEGd8FyxeA3yEl2MPvEg7',
  'Heavy Metal': '2x3yu5txW2IpqH9AihnHcS',
  'Hip Hop': '6HswfLHtPYUaAj7JD9HEIK',
  Indie: '56WyFyn0ZROlAO434bE24v',
  Jazz: '1a4lmrvTvNMV2fWB460JJX',
  Latin: '11P5yrfWAIG7ojkuGOzyZm',
  Pop: '48g1jWlR7e6eM3QEMQcFVq',
  Punk: '5zTpB68MEk6F8nRNkPS2ek',
  'R&B': '7KlsYo1biWhOEw5bqhJB51',
  Reggae: '1epjKELZ0QNSZqQcSaSvAX',
  Rock: '4bUKf446jDc5jRlpKp0Xz9',
  'Rock en Español': '2hKJnecMuebytIt0ryDkMT',
  Romance: '4tandKUfWJ512KCmo8tCNo',
  Soul: '6EPXMsvFMDBoYaiyxBq2Z9',
}

console.log(spotifyPlaylistsIds !== null)
console.log(spotifyTestEnvPlaylistIds !== null)

let usersIndex = 0

export const preloadPlaylists = async (
  session: Session,
  userIds: number[],
  genres: Genre[],
): Promise<void> => {
  const playlistsService = new PlaylistsService(session)
  const spotifyService = new SpotifyService(session)
  for (const genre of genres) {
    const playlist = await playlistsService.getByGenreIdOrCreate(genre.id)
    const currentSpotifyPlaylistSongs = await spotifyService.getPlaylistItems(
      playlist.spotifyId,
      0,
      10,
    )
    console.log(`genre ${genre.name}, spotifyId ${playlist.spotifyId}`)
    if (currentSpotifyPlaylistSongs.total > 0) {
      console.log(`Playlist for genre ${genre.name} already processed. Skipping...`)
      continue
    }
    const genreSongs = await loadGenreSongsFromJson(genre.name)
    await addSongsToPlaylist(genre.name, genreSongs, playlist.id, userIds, session)
    usersIndex += 10
  }
}

export const loadGenreSongsFromJson = async (
  genre: string,
): Promise<{ name: string; artist: string }[] | null> => {
  try {
    const fileName = camelCase(genre)
    const rawData = fs.readFileSync(`./scripts/songs/${fileName}.json`)
    const songsData = JSON.parse(rawData.toString())
    return songsData
  } catch (error) {
    console.log(`Json file for genre ${genre} not found`)
    return null
  }
}

export const addSongsToPlaylist = async (
  genre: string,
  songs: { name: string; artist: string }[] | null,
  playlistId: number,
  userIds: number[],
  session: Session,
): Promise<void> => {
  if (!songs) {
    return
  }
  let localUserIndex = usersIndex
  let songsIndex = 0
  const playlistsService = new PlaylistsService(session)
  const spotifyService = new SpotifyService(session)
  console.log(`Adding songs to playlist for genre ${genre} and playlistId: ${playlistId}`)
  for (const song of songs) {
    try {
      const searchResponse = await spotifyService.searchSong(`${song.name} ${song.artist}`)
      const songs = searchResponse.songs
      if (!songs || songs.length === 0) {
        console.log(`Didnt find song ${song.name} by ${song.artist} in Spotify`)
        continue
      }
      const firstSong = songs[0]
      const userId = userIds[localUserIndex]
      console.log(
        `Adding song ${firstSong.name}. songsIndex ${songsIndex}. userIndex ${localUserIndex}`,
      )
      await playlistsService.addSongToPlaylist(userId, playlistId, firstSong)
      songsIndex++
      // every 10 songs we use a different user
      localUserIndex = songsIndex % 10 === 0 ? localUserIndex + 1 : localUserIndex
    } catch (error) {
      console.log(`Error adding song ${song.name} to playlist ${playlistId}`, error)
    }
  }
  console.log('usersIndex', usersIndex)
}
