import { Request, Response, Router } from 'express';
import { fcLoginUser, fcRefreshAccessToken, fcRegisterUser } from './auth.route';
import upload from '../libs/multer';
import { fcCreateUser, fcGetMe, fcGetUsers } from './users.route';
import { authValidator } from '../middlewares/authentication.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';
import { RegisterAuthSchema, LoginAuthSchema, RefreshAuthSchema } from '../schemas/auth.schema';
import { GetUsersSchema } from '../schemas/users.schema';


const router = Router();

// http://localhost:3977/api/
router.route('/').get((req: Request, res: Response) => {
  return res.send('Hey, welcome to API-Restful Personal Web')
});

// http://localhost:3977/api/auth/register
router.route('/auth/register')
  .post(schemaValidator(RegisterAuthSchema), fcRegisterUser);

// http://localhost:3977/api/auth/login
router.route('/auth/login')
  .post(schemaValidator(LoginAuthSchema), fcLoginUser);

// http://localhost:3977/api/auth/refresh
router.route('/auth/refresh')
  .post(schemaValidator(RefreshAuthSchema), fcRefreshAccessToken);

// http://localhost:3977/api/users/me
router.route('/users/me')
  .get(authValidator, fcGetMe);

// http://localhost:3977/api/users/
router.route('/users/')
  .get([authValidator, schemaValidator(GetUsersSchema)], fcGetUsers)
  .post([authValidator, upload.single('avatar')], fcCreateUser);

export default router;
