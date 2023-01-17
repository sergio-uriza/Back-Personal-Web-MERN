import { IUser } from '../../models/user.model'
import { IMenu } from '../../models/menu.model'
import { ICourse } from '../../models/course.model'
import { Types } from 'mongoose'

export type ObjUserType = Partial<IUser> & Partial<{ _id: Types.ObjectId }>
export type ObjMenuType = Partial<IMenu> & Partial<{ _id: Types.ObjectId }>
export type ObjCourseType = Partial<ICourse> & Partial<{ _id: Types.ObjectId }>
