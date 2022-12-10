import { Request, Response } from 'express';
import { AuthController } from '../controllers/authController';


const controller: AuthController = new AuthController;

export async function fcRegisterUser(req: Request, res: Response) {

  const { firstname, lastname, email, password } = req?.body;

  if( !firstname || !lastname || !email || !password ) return res.status(400).send({ msg: 'ERROR: Missing data' });

  try {
    const response = await controller.registerUser(firstname, lastname, email, password);
    return res.status(201).send(response);
  
  } catch (err) {
    return res.status(400).send({ msg: 'ERROR: Some of the data in request is invalid' });
  }
}


export async function fcLoginUser(req: Request, res: Response) {

  const { email, password } = req?.body;

  if( !email || !password ) return res.status(400).send({ msg: 'ERROR: Missing data' });

  try {
    const controller: AuthController = new AuthController;
    const response = await controller.loginUser(email, password);
    return res.status(200).send(response);
  
  } catch (err) {
    if( err instanceof Error && err.message === 'loginError' ) return res.status(500).send({ msg: 'Server Error' });
    if( err instanceof Error && err.message === 'unauthorizedError' ) return res.status(401).send({ msg: 'Unauthorized User Error' });
    return res.status(400).send({ msg: 'ERROR: Some of the data in request is invalid' });
  }
}


export async function fcRefreshAccessToken(req: Request, res: Response) {

  const { token } = req?.body;

  if( !token ) return res.status(400).send({ msg: 'ERROR: Missing data' });

  try {
    const controller: AuthController = new AuthController;
    const response = await controller.refreshAccessToken(token);
    return res.status(200).send(response);
    
  } catch (err) {
    return res.status(400).send({ msg: 'ERROR: Some of the data in request is invalid' });
  }
}
