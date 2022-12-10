import { Types } from 'mongoose';

export interface IUserSchema {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  role: string,
  active: boolean,
  avatar?: string,
}
