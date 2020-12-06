import { User } from '../../types'
import { BaseDao } from '../../shared'

export class UsersDao extends BaseDao<User> {
  get createQuery(): string {
    return `
    CREATE (newUser:User)
    SET newUser = $data
    SET newUser.created = datetime()
    CREATE (newUserSpotifyData:SpotifyData)
    SET newUserSpotifyData = $spotifyData
    SET newUserSpotifyData.created = datetime()
    CREATE
    (newUser)-[:HAS_SPOTIFY_DATA]->(newUserSpotifyData)
    RETURN newUser{ .*, id: ID(newUser), spotifyData: newUserSpotifyData{.*} };
    `
  }

  get updateQuery(): string {
    return `
    MATCH (user:User)
    WHERE ID(user) = $id
    MERGE (user)-[r:HAS_SPOTIFY_DATA]->(spotifyData: SpotifyData)
    SET user += $userData
    SET user.updated = datetime()
    SET spotifyData += $spotifyData
    SET spotifyData.updated = datetime()
    RETURN user{ .*, id: ID(user), spotifyData: spotifyData{.*} };
    `
  }

  get loadByEmailQuery(): string {
    return `
    MATCH (node:User)
    WHERE node.email = '$email'
    OPTIONAL MATCH (node)-[r:HAS_SPOTIFY_DATA]->(spotifyData: SpotifyData)
    RETURN node{.*, id: ID(node), spotifyData: spotifyData{.*}}
    `
  }

  get loadAllQuery(): string {
    return `
    MATCH (allNodes:User)
    OPTIONAL MATCH (allNodes)-[r:HAS_SPOTIFY_DATA]->(spotifyData: SpotifyData)
    RETURN allNodes{.*, id: ID(allNodes), spotifyData: spotifyData{.*}}
    `
  }

  get loadByIdQuery(): string {
    return `
    MATCH (node:User)
    WHERE ID(node) = $id
    OPTIONAL MATCH (node)-[r:HAS_SPOTIFY_DATA]->(spotifyData: SpotifyData)
    RETURN node{.*, id: ID(node), spotifyData: spotifyData{.*}}
    `
  }

  get loadByIdsQuery(): string {
    return `
    MATCH (nodes:User)
    WHERE ID(nodes) IN [$ids]
    OPTIONAL MATCH (nodes)-[r:HAS_SPOTIFY_DATA]->(spotifyData: SpotifyData)
    RETURN nodes{.*, id: ID(nodes), spotifyData: spotifyData{.*}}
    `
  }

  async create(data: User): Promise<User> {
    const { spotifyData, ...finalUserData } = data
    this.schema.validateSync(data, { abortEarly: false })
    return this.queryHelper.executeQueryAndReturnFirst({
      query: this.createQuery,
      mapBy: 'newUser',
      options: { data: finalUserData, spotifyData },
    })
  }

  update(id: number, data: Partial<User>): Promise<User> {
    const { spotifyData = {}, ...userData } = data
    const query = this.updateQuery.replace('$id', `${id}`)
    return this.queryHelper.executeQueryAndReturnFirst<User>({
      query,
      mapBy: 'user',
      options: { userData, spotifyData },
    })
  }

  async loadByEmail(email = ''): Promise<User | null> {
    const query = this.loadByEmailQuery.replace('$email', email)
    return this.queryHelper.executeQueryAndReturnFirst({ query, mapBy: 'node' })
  }
}
