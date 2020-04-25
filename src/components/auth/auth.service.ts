import { generateToken } from '../../shared/util/auth'
import { UsersService } from '../users/users.service'
import { User, DecodedToken, AuthResponse } from '../../types'
import { MailgunUtil } from '../../shared'

export class AuthService {
  usersService: UsersService

  constructor() {
    this.usersService = new UsersService()
  }

  async authSocial(user: User): Promise<AuthResponse> {
    const userData = { ...user }
    const { isNewUser, dbUser } = await this.usersService.getByEmailOrCreate(user.email, userData)
    if (isNewUser) {
      void MailgunUtil.sendWelcomeEmail(dbUser)
    }
    const token = generateToken(dbUser._id)
    return {
      user: dbUser,
      token,
    }
  }

  async refreshToken(tokenData: DecodedToken): Promise<AuthResponse> {
    const user = await this.usersService.getDetailById(tokenData.userId)
    const token = generateToken(user._id)
    return {
      token,
      user,
    }
  }
}
