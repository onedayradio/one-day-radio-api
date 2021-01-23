import { Session } from 'neo4j-driver'
import { PlaylistsService } from '../src/components'
import { Genre } from '../src/types'

const spotifyPlaylistsIds = {
  Blues: '2ZTj5pvbmXeMBpXpDpCPNc',
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

console.log(spotifyPlaylistsIds)

export const preloadPlaylists = async (
  session: Session,
  userIds: number[],
  genres: Genre[],
): Promise<void> => {
  const playlistsService = new PlaylistsService(session)
  for (const genre of genres) {
    const playlist = await playlistsService.getByGenreIdOrCreate(genre.id)
    console.log(`Playlist for genre ${genre.name}, spotifyId ${playlist.spotifyId}`)
    break
  }
}
