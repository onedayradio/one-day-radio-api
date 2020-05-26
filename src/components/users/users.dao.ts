import { UserModel } from './user'
import { DBUser, User, UserUpdateData } from '../../types'

export class UsersDao {
  async loadByIds(ids: string[]): Promise<DBUser[]> {
    const users = await UserModel.find({ _id: { $in: ids } })
    return users
  }

  create(userData: User): Promise<DBUser> {
    const newUser = new UserModel(userData)
    return newUser.save()
  }

  async getDetailById(id: string): Promise<DBUser | null> {
    return UserModel.findById(id)
  }

  async getDetailByEmail(email: string): Promise<DBUser | null> {
    return UserModel.findOne({ email })
  }

  async update(dbUser: DBUser, updateData: UserUpdateData): Promise<DBUser> {
    return dbUser.updateOne(updateData)
  }
}
