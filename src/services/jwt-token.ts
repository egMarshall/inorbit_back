import { env } from '../env'
import { sign, verify, decode, type JwtPayload } from 'jsonwebtoken'

export interface TokenPayload extends JwtPayload {
  data: {
    userId: string
  }
}

export const createToken = (data: object) => {
  return sign(
    {
      data,
    },
    env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  )
}

export const verifyToken = (token: string): TokenPayload => {
  return verify(token, env.JWT_SECRET) as TokenPayload
}

export const decodeToken = (token: string) => {
  return decode(token)
}
