import { ApolloError } from 'apollo-server-lambda'
import { Session } from 'neo4j-driver'

import { UsersDao } from './users.dao'
import { User, UserGetOrCreateResponse } from '../../types'
import { BaseService } from '../../shared'
import { UserSchema } from './user.schema'

export class UsersService extends BaseService<User, UsersDao> {
  constructor(session: Session) {
    const dao = new UsersDao({ session, schema: UserSchema, label: 'User' })
    super(session, dao)
  }

  async create(data: Partial<User>): Promise<User> {
    const existingUser = await this.dao.loadByEmail(data.email)
    if (existingUser) {
      throw new ApolloError(`User with email ${data.email} already exists!`)
    }
    return this.dao.create(data)
  }

  async loadByEmail(email: string): Promise<User> {
    const user = await this.dao.loadByEmail(email)
    if (!user) {
      throw new ApolloError(`User with email ${email} not found in the database`)
    }
    return user
  }

  async update(userId: number, updateData: Partial<User>): Promise<User> {
    const dbUser = await this.dao.loadById({ id: userId })
    if (!dbUser) {
      throw new ApolloError(`User with id ${userId} not found in the database`)
    }
    return this.dao.update(userId, updateData)
  }

  async getByEmailOrCreate(
    email: string,
    userData: User | Partial<User>,
  ): Promise<UserGetOrCreateResponse> {
    try {
      const dbUser = await this.loadByEmail(email)
      return {
        isNewUser: false,
        dbUser: await this.update(dbUser.id, userData),
      }
    } catch (error) {
      const dbUser = await this.create(userData as User)
      return {
        isNewUser: true,
        dbUser,
      }
    }
  }
}
