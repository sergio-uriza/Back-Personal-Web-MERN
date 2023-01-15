import { Request, Response, NextFunction } from 'express'
import { TokenType } from '../enums/tokenType.enum'
import { decodedToken } from '../libs/jwt'

export const authValidator = (req: Request, res: Response, next: NextFunction): void => {
  if (req.headers.authorization == null) {
    res.status(403).send({ message: 'Missing authentication header in request' })
    return
  }
  if (!req.headers.authorization.toLowerCase().startsWith('bearer ')) {
    res.status(400).send({ message: 'Invalid Token Error' })
    return
  }

  try {
    const token = req.headers.authorization.substring(7)
    const payloadToken = decodedToken(token)
    if (typeof payloadToken === 'string' || payloadToken.userId == null || payloadToken.type == null || payloadToken.type !== TokenType.ACCESS) {
      throw new Error('Invalid Token Error')
    }

    req.user = payloadToken.userId
    next()
    return
  } catch (err) {
    res.status(400).send({ message: 'Invalid Token Error' })
  }
}
