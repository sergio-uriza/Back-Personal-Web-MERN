import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { TokenType } from '../enums/tokenType.enum'

// Configuration the .env file
dotenv.config()
const secretAccJWT: string = process.env.SECRET_ACC_TOKEN ?? 'D1vFh9w4Vr856tQpuz0mfE43'
const secretRefJWT: string = process.env.SECRET_REF_TOKEN ?? 'dFre07TmcnvV91mFtewal4z5'

interface IPayloadToken {
  type?: TokenType
  userId?: string
  iat?: number
  exp?: number
}

export const createAccessToken = (userId: string): string => {
  const payload: Omit<IPayloadToken, 'iat' | 'exp'> = {
    type: TokenType.ACCESS,
    userId
  }

  return jwt.sign(payload, secretAccJWT, { expiresIn: '1h' })
}

export const createRefreshToken = (userId: string): string => {
  const payload: Omit<IPayloadToken, 'iat' | 'exp'> = {
    type: TokenType.REFRESH,
    userId
  }

  return jwt.sign(payload, secretRefJWT, { expiresIn: '8h' })
}

export const decodedAccToken = (token: string): string | IPayloadToken => {
  return jwt.verify(token, secretAccJWT, { ignoreExpiration: false }) as string | IPayloadToken
}

export const decodedRefToken = (token: string): string | IPayloadToken => {
  return jwt.verify(token, secretRefJWT, { ignoreExpiration: false }) as string | IPayloadToken
}
