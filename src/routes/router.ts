/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from 'express'
import { fcLoginUser, fcRefreshAccessToken, fcRegisterUser } from './auth.route'
import { uploadAvatar } from '../middlewares/upload.middleware'
import { fcCreateUser, fcDeleteUser, fcGetMe, fcGetUsers, fcUpdateUser } from './users.route'
import { authValidator } from '../middlewares/authentication.middleware'
import { schemaValidator } from '../middlewares/schemaValidator.middleware'
import { RegisterAuthSchema, LoginAuthSchema, RefreshAuthSchema } from '../schemas/auth.schema'
import { CreateUsersSchema, DeleteUsersSchema, GetUsersSchema, UpdateUsersSchema } from '../schemas/users.schema'
import { fcCreateMenu, fcDeleteMenu, fcGetMenu, fcUpdateMenu } from './menu.route'
import { CreateMenuSchema, DeleteMenuSchema, GetMenuSchema, UpdateMenuSchema } from '../schemas/menu.schema'

const router = Router()

// http://localhost:3977/api/
router.route('/').get((_req: Request, res: Response): void => {
  res.send('Hey, welcome to API-Restful Personal Web')
})

// http://localhost:3977/api/auth/register
router.route('/auth/register')
  .post(schemaValidator(RegisterAuthSchema), fcRegisterUser)

// http://localhost:3977/api/auth/login
router.route('/auth/login')
  .post(schemaValidator(LoginAuthSchema), fcLoginUser)

// http://localhost:3977/api/auth/refresh
router.route('/auth/refresh')
  .post(schemaValidator(RefreshAuthSchema), fcRefreshAccessToken)

// http://localhost:3977/api/users/me
router.route('/users/me')
  .get(authValidator, fcGetMe)

// http://localhost:3977/api/users/
router.route('/users/')
  .get([authValidator, schemaValidator(GetUsersSchema)], fcGetUsers)
  .post([authValidator, uploadAvatar, schemaValidator(CreateUsersSchema)], fcCreateUser)

// http://localhost:3977/api/users/:id
router.route('/users/:id')
  .patch([authValidator, uploadAvatar, schemaValidator(UpdateUsersSchema)], fcUpdateUser)
  .delete([authValidator, schemaValidator(DeleteUsersSchema)], fcDeleteUser)

// http://localhost:3977/api/menu
router.route('/menu')
  .get(schemaValidator(GetMenuSchema), fcGetMenu)
  .post([authValidator, schemaValidator(CreateMenuSchema)], fcCreateMenu)

// http://localhost:3977/api/menu/:id
router.route('/menu/:id')
  .patch([authValidator, schemaValidator(UpdateMenuSchema)], fcUpdateMenu)
  .delete([authValidator, schemaValidator(DeleteMenuSchema)], fcDeleteMenu)

export default router
