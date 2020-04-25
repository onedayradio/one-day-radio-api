import Crypto from 'crypto'

export const generateRandomString = (size: number): string => {
  return Crypto.randomBytes(16).toString('hex').slice(0, size)
}
