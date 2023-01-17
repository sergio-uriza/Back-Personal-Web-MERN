/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from 'express'
import { fcLoginUser, fcRefreshAccessToken, fcRegisterUser } from './auth.route'
import { uploadSingleAvatar, uploadSingleMiniature } from '../middlewares/upload.middleware'
import { fcCreateUser, fcDeleteUser, fcGetMe, fcGetUsers, fcUpdateUser } from './user.route'
import { authValidator } from '../middlewares/authentication.middleware'
import { schemaValidator } from '../middlewares/schemaValidator.middleware'
import { RegisterAuthSchema, LoginAuthSchema, RefreshAuthSchema } from '../schemas/auth.schema'
import { CreateUserSchema, DeleteUserSchema, GetUserSchema, UpdateUserSchema } from '../schemas/user.schema'
import { fcCreateMenu, fcDeleteMenu, fcGetMenus, fcUpdateMenu } from './menu.route'
import { CreateMenuSchema, DeleteMenuSchema, GetMenuSchema, UpdateMenuSchema } from '../schemas/menu.schema'
import { CreateCourseSchema, DeleteCourseSchema, GetCourseSchema, UpdateCourseSchema } from '../schemas/course.schema'
import { fcCreateCourse, fcDeleteCourse, fcGetCourses, fcUpdateCourse } from './course.route'

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

// http://localhost:3977/api/user/me
router.route('/user/me')
  .get(authValidator, fcGetMe)

// http://localhost:3977/api/user/
router.route('/user/')
  .get([authValidator, schemaValidator(GetUserSchema)], fcGetUsers)
  .post([authValidator, uploadSingleAvatar, schemaValidator(CreateUserSchema)], fcCreateUser)

// http://localhost:3977/api/user/:id
router.route('/user/:id')
  .patch([authValidator, uploadSingleAvatar, schemaValidator(UpdateUserSchema)], fcUpdateUser)
  .delete([authValidator, schemaValidator(DeleteUserSchema)], fcDeleteUser)

// http://localhost:3977/api/menu
router.route('/menu')
  .get(schemaValidator(GetMenuSchema), fcGetMenus)
  .post([authValidator, schemaValidator(CreateMenuSchema)], fcCreateMenu)

// http://localhost:3977/api/menu/:id
router.route('/menu/:id')
  .patch([authValidator, schemaValidator(UpdateMenuSchema)], fcUpdateMenu)
  .delete([authValidator, schemaValidator(DeleteMenuSchema)], fcDeleteMenu)

// http://localhost:3977/api/course
router.route('/course')
  .get(schemaValidator(GetCourseSchema), fcGetCourses)
  .post([authValidator, uploadSingleMiniature, schemaValidator(CreateCourseSchema)], fcCreateCourse)

// http://localhost:3977/api/course/:id
router.route('/course/:id')
  .patch([authValidator, uploadSingleMiniature, schemaValidator(UpdateCourseSchema)], fcUpdateCourse)
  .delete([authValidator, schemaValidator(DeleteCourseSchema)], fcDeleteCourse)

export default router
