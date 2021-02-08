import 'dotenv/config'
import neo4j, { Config } from 'neo4j-driver'
import { GenresService } from '../src/components'
import { preloadPlaylists } from './playlists-loader'
import { preloadUsers } from './users-loader'

const preload = async () => {
  const env = process.env['environment']
  const neo4jUrl = process.env['neo4j_url'] || ''
  const username = process.env['neo4j_username'] || ''
  const password = process.env['neo4j_password'] || ''
  const options = env === 'local' ? undefined : ({ encrypted: 'ENCRYPTION_ON' } as Config)
  const driver = neo4j.driver(neo4jUrl, neo4j.auth.basic(username, password), options)
  const userIds = await preloadUsers(driver.session())
  const allGenres = await new GenresService(driver.session()).loadAll({ orderBy: 'name' })
  await preloadPlaylists(driver.session(), userIds, allGenres)
  console.log(userIds !== null)
  console.log(allGenres !== null)
}

preload()
  .then(() => console.log('Neo4J preload success!!!!'))
  .catch((err) => console.error('Error preloading Neo4J', err, err.message))
