/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { IUser } from '../../models/user.model'
import { IMenu } from '../../models/menu.model'
import { ICourse } from '../../models/course.model'
import { IBlog } from '../../models/blog.model'
import { INewsletter } from '../../models/newsletter.model'
import { Types } from 'mongoose'

// GENERIC MESSAGE TYPE
export type MessageResType = {
  message: string
}

// AUTH CONTROLLER TYPES
export type LoginUserType = {
  accessToken: string
  refreshToken: string
}
export type RefreshAccessTokenType = {
  accessToken: string
}

// USER CONTROLLER TYPES
export type GetMyUserType = Omit<IUser, 'password' | 'updatedAt' | 'active'> & { _id: Types.ObjectId }
export type GetMultipleUserType = Omit<IUser, 'password'> & { _id: Types.ObjectId }
export type ObjUserType = IUser & { _id: Types.ObjectId }

// MENU CONTROLLER TYPES
export type ObjMenuType = IMenu & { _id: Types.ObjectId }

// COURSE CONTROLLER TYPES
export type GetMultipleCourseType = {
  docs: ObjCourseType[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
}
export type ObjCourseType = ICourse & { _id: Types.ObjectId }

// BLOG CONTROLLER TYPES
export type GetMultipleBlogType = {
  docs: ObjBlogPopulateType[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
}
export type GetMyMultipleBlogType = {
  docs: ObjMyBlogType[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
}
export type ObjBlogType = IBlog & { _id: Types.ObjectId }
export type ObjMyBlogType = Omit<IBlog, 'user'> & { _id: Types.ObjectId }
export type ObjBlogPopulateType = Omit<IBlog, 'user'> & { user?: Pick<IUser, 'firstname' | 'lastname'> } & { _id: Types.ObjectId }

// NEWSLETTER CONTROLLER TYPES
export type GetEmailsNewsletterType = {
  docs: ObjNewsletterType[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
}
export type ObjNewsletterType = INewsletter & { _id: Types.ObjectId }
