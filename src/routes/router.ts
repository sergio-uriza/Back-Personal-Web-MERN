/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from 'express'
import { authValidator } from '../middlewares/authentication.middleware'
import { schemaValidator } from '../middlewares/schemaValidator.middleware'
import { fcLoginAdmin, fcLoginUser, fcRefreshAccessToken, fcRegisterUser } from './auth.route'
import { uploadSingleAvatar, uploadSingleCourse, uploadSingleBlog } from '../middlewares/upload.middleware'
import { fcCreateUser, fcDeleteUser, fcGetMyUser, fcGetMultipleUser, fcUpdateMeUser, fcUpdateUser } from './user.route'
import { RegisterAuthSchema, LoginAuthSchema, RefreshAuthSchema } from '../schemas/auth.schema'
import { CreateUserSchema, DeleteUserSchema, GetMultipleUserSchema, UpdateMyUserSchema, UpdateUserSchema } from '../schemas/user.schema'
import { fcCreateMenu, fcDeleteMenu, fcGetMultipleMenu, fcUpdateMenu } from './menu.route'
import { CreateMenuSchema, DeleteMenuSchema, GetMultipleMenuSchema, UpdateMenuSchema } from '../schemas/menu.schema'
import { CreateCourseSchema, DeleteCourseSchema, GetMultipleCourseSchema, UpdateCourseSchema } from '../schemas/course.schema'
import { fcCreateCourse, fcDeleteCourse, fcGetMultipleCourse, fcUpdateCourse } from './course.route'
import { fcCreateBlog, fcDeleteBlog, fcDeleteMyBlog, fcGetByPathBlog, fcGetMultipleBlog, fcGetMyMultipleBlog, fcUpdateBlog, fcUpdateMyBlog } from './blog.route'
import { CreateBlogSchema, DeleteBlogSchema, GetByPathBlogSchema, GetMultipleBlogSchema, UpdateBlogSchema } from '../schemas/blog.schema'
import { DeleteEmailNewsletterSchema, GetEmailsNewsletterSchema, SuscribeEmailNewsletterSchema } from '../schemas/newsletter.schema'
import { fcDeleteEmailNewsletter, fcGetEmailsNewsletter, fcSuscribeEmailNewsletter } from './newsletter.route'
import { userExistence, adminExistence } from '../middlewares/roleExistenceValidator.middleware'

const router = Router()

// http://localhost:3977/api/auth/register
router.route('/auth/register')
  .post(schemaValidator(RegisterAuthSchema), fcRegisterUser)

// http://localhost:3977/api/auth/login
router.route('/auth/login')
  .post(schemaValidator(LoginAuthSchema), fcLoginUser)

// http://localhost:3977/api/auth/login_admin
router.route('/auth/login_admin')
  .post(schemaValidator(LoginAuthSchema), fcLoginAdmin)

// http://localhost:3977/api/auth/refresh
router.route('/auth/refresh')
  .post(schemaValidator(RefreshAuthSchema), fcRefreshAccessToken)

// http://localhost:3977/api/user/my
router.route('/user/my')
  .get([authValidator, userExistence], fcGetMyUser)
  .patch([authValidator, userExistence, uploadSingleAvatar, schemaValidator(UpdateMyUserSchema)], fcUpdateMeUser)

// http://localhost:3977/api/user
router.route('/user')
  .get([authValidator, adminExistence, schemaValidator(GetMultipleUserSchema)], fcGetMultipleUser)
  .post([authValidator, adminExistence, uploadSingleAvatar, schemaValidator(CreateUserSchema)], fcCreateUser)

// http://localhost:3977/api/user/:id
router.route('/user/:id')
  .patch([authValidator, adminExistence, uploadSingleAvatar, schemaValidator(UpdateUserSchema)], fcUpdateUser)
  .delete([authValidator, adminExistence, schemaValidator(DeleteUserSchema)], fcDeleteUser)

// http://localhost:3977/api/menu
router.route('/menu')
  .get(schemaValidator(GetMultipleMenuSchema), fcGetMultipleMenu)
  .post([authValidator, adminExistence, schemaValidator(CreateMenuSchema)], fcCreateMenu)

// http://localhost:3977/api/menu/:id
router.route('/menu/:id')
  .patch([authValidator, adminExistence, schemaValidator(UpdateMenuSchema)], fcUpdateMenu)
  .delete([authValidator, adminExistence, schemaValidator(DeleteMenuSchema)], fcDeleteMenu)

// http://localhost:3977/api/course
router.route('/course')
  .get(schemaValidator(GetMultipleCourseSchema), fcGetMultipleCourse)
  .post([authValidator, adminExistence, uploadSingleCourse, schemaValidator(CreateCourseSchema)], fcCreateCourse)

// http://localhost:3977/api/course/:id
router.route('/course/:id')
  .patch([authValidator, adminExistence, uploadSingleCourse, schemaValidator(UpdateCourseSchema)], fcUpdateCourse)
  .delete([authValidator, adminExistence, schemaValidator(DeleteCourseSchema)], fcDeleteCourse)

// http://localhost:3977/api/blog/my
router.route('/blog/my')
  .get([authValidator, userExistence, schemaValidator(GetMultipleBlogSchema)], fcGetMyMultipleBlog)

// http://localhost:3977/api/blog/my/:id
router.route('/blog/my/:id')
  .patch([authValidator, userExistence, uploadSingleBlog, schemaValidator(UpdateBlogSchema)], fcUpdateMyBlog)
  .delete([authValidator, userExistence, schemaValidator(DeleteBlogSchema)], fcDeleteMyBlog)

// http://localhost:3977/api/blog/:path
router.route('/blog/:path')
  .get(schemaValidator(GetByPathBlogSchema), fcGetByPathBlog)

// http://localhost:3977/api/blog
router.route('/blog')
  .get(schemaValidator(GetMultipleBlogSchema), fcGetMultipleBlog)
  .post([authValidator, userExistence, uploadSingleBlog, schemaValidator(CreateBlogSchema)], fcCreateBlog)

// http://localhost:3977/api/blog/:id
router.route('/blog/:id')
  .patch([authValidator, adminExistence, uploadSingleBlog, schemaValidator(UpdateBlogSchema)], fcUpdateBlog)
  .delete([authValidator, adminExistence, schemaValidator(DeleteBlogSchema)], fcDeleteBlog)

// http://localhost:3977/api/newsletter
router.route('/newsletter')
  .get([authValidator, adminExistence, schemaValidator(GetEmailsNewsletterSchema)], fcGetEmailsNewsletter)
  .post(schemaValidator(SuscribeEmailNewsletterSchema), fcSuscribeEmailNewsletter)

// http://localhost:3977/api/newsletter/:id
router.route('/newsletter/:id')
  .delete([authValidator, adminExistence, schemaValidator(DeleteEmailNewsletterSchema)], fcDeleteEmailNewsletter)

// http://localhost:3977/api/
router.route('/').get((_req: Request, res: Response): void => {
  res.send('Hey, welcome to API-Restful Personal Web')
})

export default router
