import { keyBy } from 'lodash'
import { ApolloError } from 'apollo-server-lambda'

import { UsersDao } from './users.dao'
import { User, DBUser, UserGetOrCreateResponse } from '../../types'

export class UsersService {
  usersDao: UsersDao

  constructor() {
    this.usersDao = new UsersDao()
  }

  async loadByIds(ids: string[]): Promise<DBUser[]> {
    const users = await this.usersDao.loadByIds(ids)
    const usersById = keyBy(users, '_id')
    const usersSorted = ids.map((userId: string) => usersById[userId])
    return usersSorted
  }

  create(data: User): Promise<DBUser> {
    return this.usersDao.create(data)
  }

  async getDetailByEmail(email: string): Promise<DBUser> {
    const user = await this.usersDao.getDetailByEmail(email)
    if (!user) {
      throw new ApolloError(`User with email ${email} not found in the database`)
    }
    return user
  }

  async getDetailById(userId: string): Promise<DBUser> {
    const user = await this.usersDao.getDetailById(userId)
    if (!user) {
      throw new ApolloError(`User with id ${userId} not found in the database`)
    }
    return user
  }

  async updateUser(userId: string, updateData: User): Promise<DBUser> {
    delete updateData.email
    const dbUser = await this.usersDao.getDetailById(userId)
    if (!dbUser) {
      throw new ApolloError(`User with id ${userId} not found in the database`)
    }
    await this.usersDao.update(dbUser, updateData)
    return this.getDetailById(userId)
  }

  async getByEmailOrCreate(email: string, userData: User): Promise<UserGetOrCreateResponse> {
    try {
      const dbUser = await this.getDetailByEmail(email)
      return {
        isNewUser: false,
        dbUser: await this.updateUser(dbUser._id, userData),
      }
    } catch (error) {
      const dbUser = await this.create(userData)
      return {
        isNewUser: true,
        dbUser,
      }
    }
  }
}
