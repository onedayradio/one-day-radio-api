import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-lambda'

import { getValue } from './config'
import { DecodedToken } from '../../types'

export const generateToken = (userId: string): string => {
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
  let decoded: any
  try {
    decoded = await jwt.verify(token, getValue(tokenSecretKey))
  } catch (error) {
    throw new AuthenticationError('Unauthorized!!')
  }
  return {
    userId: decoded.id,
    userRoles: decoded.roles,
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
