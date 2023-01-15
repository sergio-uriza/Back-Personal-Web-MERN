import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { TokenType } from '../enums/tokenType.enum'

// Configuration the .env file
dotenv.config()

// Create Express APP
const secretJWT: string = process.env.SECRETKEY ?? 'SECRETKEY'

// Create Interface of tokens
interface IPayloadToken extends jwt.JwtPayload {
  type?: TokenType
  userId?: string
}

export const createAccessToken = (userId: string): string => {
  const payload: IPayloadToken = {
    type: TokenType.ACCESS,
    userId
  }

  return jwt.sign(payload, secretJWT, { expiresIn: '1h' })
}

export const createRefreshToken = (userId: string): string => {
  const payload: IPayloadToken = {
    type: TokenType.REFRESH,
    userId
  }

  return jwt.sign(payload, secretJWT, { expiresIn: '8h' })
}

export const decodedToken = (token: string): string | IPayloadToken => {
  return jwt.verify(token, secretJWT, { ignoreExpiration: false }) as string | IPayloadToken
}
