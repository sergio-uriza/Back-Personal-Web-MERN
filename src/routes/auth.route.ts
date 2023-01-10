import { NextFunction, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { LoginBodyAuthType, RefreshBodyAuthType, RegisterBodyAuthType } from '../schemas/auth.schema';


const controller: AuthController = new AuthController;

export async function fcRegisterUser(req: Request, res: Response, next: NextFunction) {

  const { firstname, lastname, email, password } = req.body as RegisterBodyAuthType;
  try {
    const response = await controller.registerUser(firstname, lastname, email, password);
    return res.status(201).send(response);
  
  } catch (err) {
    next(err);
  }
}


export async function fcLoginUser(req: Request, res: Response, next: NextFunction) {

  const { email, password } = req.body as LoginBodyAuthType;
  try {
    const response = await controller.loginUser(email, password);
    return res.status(200).send(response);
  
  } catch (err) {
    next(err);
  }
}


export async function fcRefreshAccessToken(req: Request, res: Response, next: NextFunction) {

  const { refreshToken } = req.body as RefreshBodyAuthType
  try {
    const response = await controller.refreshAccessToken(refreshToken);
    return res.status(200).send(response);
    
  } catch (err) {
    next(err);
  }
}
