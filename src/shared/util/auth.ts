import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-lambda'

import { getValue } from './config'
import { DecodedToken, User } from '../../types'
import { UsersService } from '../../components'
import { Session } from 'neo4j-driver'

export const generateToken = (userId: number): string => {
  return jwt.sign({ id: userId }, getValue('token_secret'), {
    expiresIn: getValue('token_expiration'),
  })
}

export const validateToken = async (
  authorization = '',
  tokenSecretKey = 'token_secret',
): Promise<DecodedToken> => {
  const [jwtType, token] = authorization.split(' ')
  if (jwtType.toLowerCase() !== 'bearer' || !token) {
    throw new AuthenticationError('Unauthorized!!')
  }
  let decoded: { id: string }
  try {
    decoded = (await jwt.verify(token, getValue(tokenSecretKey))) as { id: string }
  } catch (error) {
    throw new AuthenticationError('Unauthorized!!')
  }
  return {
    userId: parseInt(decoded.id),
  }
}

export const getTokenData = async (
  token: string,
  tokenSecretKey = 'token_secret',
): Promise<DecodedToken | undefined> => {
  let tokenData
  try {
    tokenData = await validateToken(token, tokenSecretKey)
  } catch (error) {
    tokenData = undefined
  }
  return tokenData
}

export const getUserFromToken = async (
  session: Session,
  token: string | undefined,
): Promise<User> => {
  try {
    const tokenData = await getTokenData(token || '')
    const usersService = new UsersService(session)
    const user = await usersService.loadById({ id: tokenData?.userId || -1 })
    return user
  } catch (error) {
    throw new AuthenticationError('Unauthorized!!')
  }
}
