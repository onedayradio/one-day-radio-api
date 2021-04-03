import { Genre } from '../../types'
import { BaseDao } from '../../shared'

export class GenresDao extends BaseDao<Genre> {
  get loadAllQuery(): string {
    return `
    MATCH (allNodes:Genre)
    OPTIONAL MATCH (allNodes)-[:HAS_PLAYLIST]->(playlist:Playlist)
    RETURN (allNodes{.*, id: ID(allNodes), playlistId: ID(playlist)})
    `
  }

  get loadByIdQuery(): string {
    return `
    MATCH (node:Genre)
    WHERE ID(node) = $id
    OPTIONAL MATCH (node)-[:HAS_PLAYLIST]->(playlist:Playlist)
    RETURN (node{.*, id: ID(node), playlistId: ID(playlist)})
    `
  }
}
