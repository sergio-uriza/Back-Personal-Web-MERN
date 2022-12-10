import { Request, Response } from 'express';
import { UserController } from '../controllers/usersController';


const controller: UserController = new UserController;

export async function fcGetMe(req: Request, res: Response) {

  const userId: string | undefined = req.user.userId

  if( !userId ) return res.status(400).send({ msg: 'ERROR: Missing data' });

  try {
    const response = await controller.getMe(userId);
    return res.status(200).send(response);
  
  } catch (err) {
    return res.status(400).send({ msg: 'ERROR: Some of the data in request is invalid' });
  }
}

export async function fcGetUsers(req: Request, res: Response) {

  const active: any = req.query.active

  try {
    const response = await controller.getUsers(active);
    return res.status(200).send(response);
  
  } catch (err) {
    return res.status(400).send({ msg: 'ERROR: Some of the data in request is invalid' });
  }
}

export async function fcCreateUser(req: Request, res: Response) {

  const { firstname, lastname, email, password, role } = req.body
  const avatar = req.file?.path
  console.log("EL BODY", req.body)
  console.log("EL FILE", req.file)

  if( !firstname || !lastname || !email || !password || !role  ) return res.status(400).send({ msg: 'ERROR: Missing data' });

  try {
    const response = await controller.createUser(firstname, lastname, email, password, role, avatar);
    return res.status(200).send(response);
  
  } catch (err) {
    return res.status(400).send({ msg: 'ERROR: Some of the data in request is invalid' });
  }
}
