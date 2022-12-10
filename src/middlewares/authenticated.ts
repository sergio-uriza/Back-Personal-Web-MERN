import { Request, Response, NextFunction } from 'express';
import { decodedToken } from '../libs/jwt';

export function validateAuth(req: Request, res: Response, next: NextFunction) {
  if ( !req.headers.authorization ) {
    return res.status(403).send({ msg: 'Missing authentication header in request' });
  }

  try {
    const token = req.headers.authorization.replace('Bearer ', '')
    const payloadToken = decodedToken(token);
    if (typeof payloadToken === 'string' || !payloadToken.userId || payloadToken.type !== 'access') {
      throw new Error('tokenError');
    }

    req.user = payloadToken
    return next();

  } catch (err) {
    return res.status(400).send({ msg: 'Invalid Token' });
  }
}

