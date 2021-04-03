import faker from 'faker'
import { camelCase } from 'lodash'
import { Session } from 'neo4j-driver'

import { UsersService } from '../src/components/users/users.service'

const AMOUNT_OF_USERS = 190

export interface UserPreload {
  email: string
  firstname: string
  lastname: string
  displayName: string
  spotifyData: {
    accessToken: string
    refreshToken: string
  }
}

const emailDomains = ['gmail.com', 'gmail.com', 'gmail.com', 'yahoo.com']

export const preloadUsers = async (session: Session): Promise<number[]> => {
  console.log(`preloading ${AMOUNT_OF_USERS} users into Neo4J...`)
  const usersService = new UsersService(session)
  await removeAllUsers(usersService)
  const users = generateUsers()
  const userIds = []
  for (const user of users) {
    const newUser = await usersService.create(user)
    userIds.push(newUser.id)
  }
  return userIds
}

const generateUsers = () => {
  const users: UserPreload[] = []
  for (let index = 0; index < AMOUNT_OF_USERS; index++) {
    const fullName = (faker as any).unique(faker.fake, ['{{name.firstName}} {{name.lastName}}'])
    const emailDomain = emailDomains[faker.random.number(3)]
    const displayName = `${camelCase(fullName)}${faker.random.alphaNumeric(3)}`
    const email = `${displayName}@${emailDomain}`
    users.push({
      email,
      firstname: fullName.split(' ')[0],
      lastname: fullName.split(' ')[1],
      displayName,
      spotifyData: {
        accessToken: faker.random.alphaNumeric(10),
        refreshToken: faker.random.alphaNumeric(8),
      },
    })
  }
  return users
}

const removeAllUsers = async (usersService: UsersService) => {
  await usersService.dao.queryHelper.executeQuery({
    query: `
    MATCH (n:User)
    DETACH DELETE n;
    `,
  })

  await usersService.dao.queryHelper.executeQuery({
    query: `
    MATCH (n:SpotifyData)
    DETACH DELETE n;
    `,
  })
}
