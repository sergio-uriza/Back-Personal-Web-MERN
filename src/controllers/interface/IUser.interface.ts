export type IUser = {
  _id?: string
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  role: string,
  active: boolean,
  avatar?: string,
}