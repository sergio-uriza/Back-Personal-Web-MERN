import express, { Response, Request } from 'express';
import { fcLoginUser, fcRefreshAccessToken, fcRegisterUser } from './routes/authRoute';
import { fcCreateUser, fcGetMe, fcGetUsers } from './routes/usersRoute';
import { validateAuth } from './middlewares/authenticated';
import upload from './libs/multer';


const router = express.Router();

// http://localhost:3977/api/
router.route('/').get((req: Request, res: Response) => {
  res.send('Hey, welcome to API-Restful Personal Web')
});

// http://localhost:3977/api/auth/register
router.route('/auth/register')
  .post(fcRegisterUser);

// http://localhost:3977/api/auth/login
router.route('/auth/login')
  .post(fcLoginUser);

// http://localhost:3977/api/auth/refresh
router.route('/auth/refresh')
  .post(fcRefreshAccessToken);

// http://localhost:3977/api/users/me
router.route('/users/me')
  .get(validateAuth, fcGetMe);

// http://localhost:3977/api/users/
router.route('/users/')
  .get(validateAuth, fcGetUsers)
  .post(validateAuth, upload.single('avatar'), fcCreateUser);

export default router;
