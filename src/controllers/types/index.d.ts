import { IUser } from '../../models/user.model'

export type TUserCreate = Pick<IUser, 'firstname' | 'lastname' | 'email' | 'password' | 'role' | 'active' | 'avatar'>
export type TUserUpdate = Partial<TUserCreate>
export type TUserSearch = Pick<IUser, '_id' | 'firstname' | 'lastname' | 'email' | 'password' | 'role' | 'active' | 'avatar'>
