import { IUser } from "../interface/IUser.interface";


export type TUserSearch = Required<IUser> & Partial<Pick<IUser, 'avatar'>>
