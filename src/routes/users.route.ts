import { NextFunction, Request, Response } from 'express';
import { UserController } from '../controllers/users.controller';
import { GetBodyUsersType } from '../schemas/users.schema';
import { literalToBoolean } from '../enums/literalsBoolean.enum';


const controller: UserController = new UserController;

export async function fcGetMe(req: Request, res: Response, next: NextFunction) {

  const userId = req.user
  if( !userId ) return res.status(400).send({ msg: 'ERROR: Invalid Access Token' });
  try {
    const response = await controller.getMe(userId);
    res.status(200).send(response);
  
  } catch (err) {
    next(err);
  }
}

export async function fcGetUsers(req: Request, res: Response, next: NextFunction) {

  const { active } = req.query as GetBodyUsersType
  const activeBool = literalToBoolean(active)
  try {
    const response = await controller.getUsers(activeBool);
    res.status(200).send(response);
  
  } catch (err) {
    next(err);
  }
}

export async function fcCreateUser(req: Request, res: Response, next: NextFunction) {

  const { firstname, lastname, email, password, role } = req.body
  const avatar = req.file?.path
  console.log("EL BODY", req.body)
  console.log("EL FILE", req.file)

  if( !firstname || !lastname || !email || !password || !role  ) return res.status(400).send({ msg: 'ERROR: Missing data' });

  try {
    const response = await controller.createUser(firstname, lastname, email, password, role, avatar);
    return res.status(200).send(response);
  
  } catch (err) {
    next(err);
  }
}
