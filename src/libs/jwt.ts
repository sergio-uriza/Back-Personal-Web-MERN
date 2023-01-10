import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Configuration the .env file
dotenv.config();

// Create Express APP
const secretJWT: string = process.env.SECRETKEY || 'SECRETKEY';

// Create Interface of tokens
interface IPayloadToken {
  type: string;
  userId: string;
}

export function createAccessToken(userId: string) {

  const payload: IPayloadToken = {
    type: "access",
    userId
  };

  return jwt.sign(payload, secretJWT, { expiresIn: "1h" })
}

export function createRefreshToken(userId: string) {

  const payload: IPayloadToken = {
    type: "refresh",
    userId
  };

  return jwt.sign(payload, secretJWT, { expiresIn: "8h" })
}

export function decodedToken(token: string) {
  return jwt.verify(token, secretJWT, { ignoreExpiration: false }) as IPayloadToken
}
