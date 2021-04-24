import { Playlist, PlaylistSong, Song } from '../../types'
import { BaseDao } from '../../shared'

export class PlaylistsDao extends BaseDao<Playlist> {
  get loadByGenreIdQuery(): string {
    return `
    MATCH (playlist:Playlist)
    WHERE (playlist.genreId = $genreId)
    RETURN playlist{.*, id: ID(playlist)}
    `
  }

  get loadActiveSongsByUserQuery(): string {
    return `
    MATCH (user:User)-[userSharedSong:SHARED_SONG]->(playlistSongs:Song)<-[playlistHasSong:HAS_SONG]-(playlist:Playlist)
    WHERE ID(playlist) = $playlistId and ID(user) = $userId and playlistHasSong.active = true and userSharedSong.active = true
    RETURN { song: playlistSongs{.*, id: ID(playlistSongs)}, sharedBy: user{.*, id: ID(user)}, sharedOn: userSharedSong.date, active: playlistHasSong.active} as playlistSongs
    ORDER BY playlistSongs.sharedOn ASC
    `
  }

  get loadActiveSongsBySpotifyIdsQuery(): string {
    return `
    MATCH (playlist:Playlist)-[playlistHasSong:HAS_SONG]->(playlistSongs:Song)<-[userSharedSong:SHARED_SONG]-(user:User)
    WHERE ID(playlist) = $playlistId and playlistSongs.spotifyId in [$spotifyIds] and playlistHasSong.active = true and userSharedSong.active = true
    RETURN { song: playlistSongs{.*, id: ID(playlistSongs)}, sharedBy: user{.*, id: ID(user)}, sharedOn: userSharedSong.date, active: playlistHasSong.active} as playlistSongs
    ORDER BY playlistSongs.sharedOn ASC
    `
  }

  get loadAllPlaylistActiveSongsQuery(): string {
    return `
    MATCH (playlist:Playlist)-[playlistHasSong:HAS_SONG]->(playlistSongs:Song)<-[userSharedSong:SHARED_SONG]-(user:User)
    WHERE ID(playlist) = $playlistId and playlistHasSong.active = true and userSharedSong.active = true
    RETURN { song: playlistSongs{.*, id: ID(playlistSongs)}, sharedBy: user{.*, id: ID(user)}, sharedOn: userSharedSong.date, active: playlistHasSong.active} as playlistSongs
    ORDER BY playlistSongs.sharedOn ASC
    `
  }

  get removeSongFromPlaylistQuery(): string {
    return `
    MATCH (playlist:Playlist)-[playlistHasSong:HAS_SONG]->(playlistSong:Song)<-[userSharedSong:SHARED_SONG]-(user:User)
    WHERE ID(playlist) = $playlistId and ID(playlistSong) = $playlistSongId and playlistHasSong.active = true and userSharedSong.active = true
    SET playlistHasSong.active = false
    SET userSharedSong.active = false
    RETURN { song: playlistSong{.*, id: ID(playlistSong)}, active: playlistHasSong.active} as playlistSong
    `
  }

  get addSongToPlaylistQuery(): string {
    return `
    MERGE (song:Song{spotifyId: '$songSpotifyId'})
    ON CREATE SET song = $data
    ON MATCH  SET song += $data
    WITH song
    MATCH (user:User)
    WHERE ID(user) = $userId
    MATCH (playlist:Playlist)
    WHERE ID(playlist) = $playlistId
    CREATE (playlist)-[playlistHasSong:HAS_SONG {active: true}]->(song)<-[userSharedSong:SHARED_SONG {date: datetime(), active: true}]-(user)
    RETURN { song: song{.*, id: ID(song)}, sharedBy: user{.*, id: ID(user)}, sharedOn: userSharedSong.date, active: playlistHasSong.active } as playlistSong
    `
  }

  loadByGenreId(genreId: number): Promise<Playlist | undefined> {
    const query = this.loadByGenreIdQuery.replace('$genreId', `${genreId}`)
    return this.queryHelper.executeQueryAndReturnFirst({ query, mapBy: 'playlist' })
  }

  loadActiveSongsByUser(playlistId: number, userId: number): Promise<PlaylistSong[]> {
    const query = this.loadActiveSongsByUserQuery
      .replace('$playlistId', `${playlistId}`)
      .replace('$userId', `${userId}`)
    return this.queryHelper.executeQuery({ query, mapBy: 'playlistSongs' })
  }

  loadActiveSongsBySpotifyIds(playlistId: number, spotifyIds: string[]): Promise<PlaylistSong[]> {
    const ids = spotifyIds.reduce((acc, spotifyId) => {
      if (!acc) {
        return `'${spotifyId}'`
      }
      return `${acc}, '${spotifyId}'`
    }, '')
    const query = this.loadActiveSongsBySpotifyIdsQuery
      .replace('$playlistId', `${playlistId}`)
      .replace('$spotifyIds', `${ids}`)
    return this.queryHelper.executeQuery({ query, mapBy: 'playlistSongs' })
  }

  loadAllPlaylistActiveSongs(playlistId: number): Promise<PlaylistSong[]> {
    const query = this.loadAllPlaylistActiveSongsQuery.replace('$playlistId', `${playlistId}`)
    return this.queryHelper.executeQuery({ query, mapBy: 'playlistSongs' })
  }

  removeSongFromPlaylist(playlistId: number, playlistSongId: number): Promise<PlaylistSong> {
    const query = this.removeSongFromPlaylistQuery
      .replace('$playlistId', `${playlistId}`)
      .replace('$playlistSongId', `${playlistSongId}`)
    return this.queryHelper.executeQueryAndReturnFirst({ query, mapBy: 'playlistSong' })
  }

  addSongToPlaylist(userId: number, playlistId: number, song: Song): Promise<PlaylistSong> {
    const query = this.addSongToPlaylistQuery
      .replace('$songSpotifyId', `${song.spotifyId}`)
      .replace('$userId', `${userId}`)
      .replace('$playlistId', `${playlistId}`)
    return this.queryHelper.executeQueryAndReturnFirst({
      query,
      mapBy: 'playlistSong',
      options: { data: song },
    })
  }
}
