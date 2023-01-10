import { Request, Response, NextFunction } from 'express';
import { decodedToken } from '../libs/jwt';

export const authValidator = (req: Request, res: Response, next: NextFunction) => {
  if ( !req.headers.authorization ) {
    return res.status(403).send({ message: 'Missing authentication header in request' });
  }
  if ( !req.headers.authorization.toLowerCase().startsWith('bearer ') ) {
    return res.status(400).send({ message: 'Invalid Token Error' });
  }

  try {
    const token = req.headers.authorization.substring(7)
    const payloadToken = decodedToken(token);
    if (!payloadToken.userId || payloadToken.type !== 'access') {
      throw new Error('tokenError');
    }
    
    req.user = payloadToken.userId
    return next();

  } catch (err) {
    return res.status(400).send({ message: 'Invalid Token Error' });
  }
}

