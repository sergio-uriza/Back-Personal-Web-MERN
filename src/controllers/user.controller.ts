import User from '../models/user.model'
import { AppError } from '../utils/appError.class'
import { compareWithHash, hashString } from '../libs/bcrypt'
import { literalToBoolean } from '../enums/literalsBoolean.enum'
import { GetMyUserType, GetMultipleUserType, MessageResType, ObjUserType } from './types/index'
import { Route, Tags, Get, Security, Request, Query, Post, Patch, Delete, Path, Body } from 'tsoa'
import { CreateBodyUserType, UpdateBodyUserType, UpdateMyBodyUserType } from '../schemas/user.schema'
import fs from 'fs-extra'
import path from 'path'

@Route('/user')
@Tags('User Endpoint')
export class UserController {
  /**
   * Endpoint to obtain the data of the user making the request
   * @param userId id of the user contained in the credentials (required)
   * @returns Data of the user making the request
   */
  @Security('userAuth')
  @Get('/my')
  public async getMyUser (
    @Request() userId: string
  ): Promise<GetMyUserType> {
    const me: GetMyUserType | null = await User.findById(userId)
      .select({ _id: 1, firstname: 1, lastname: 1, email: 1, role: 1, avatar: 1 })
      .lean()
      .exec()

    if (me == null) throw new AppError(400, 'No user found')
    return me
  }

  /**
   * Endpoint to partially update the data of the user making the request
   * @param userId id of the user contained in the credentials (required)
   * @param body parameters of the user to modify (optional)
   * @param avatar new avatar for user (optional)
   * @returns Recently updated information of the user making the request
   */
  @Security('userAuth')
  @Patch('/my')
  public async updateMyUser (
    @Request() userId: string, @Body() body: UpdateMyBodyUserType, @Request() avatar?: string
  ): Promise<GetMyUserType> {
    const { oldPassword, newPassword, active } = body
    let pathOldAvatar: string | undefined

    if (newPassword != null) {
      if (oldPassword == null) throw new AppError(400, 'Old and new password are required at the same time')
      const myUserFound: ObjUserType | null = await User.findById(userId).lean().exec()
      if (myUserFound == null) throw new AppError(400, 'No user found')

      const isValidOldPassword = await compareWithHash(oldPassword, myUserFound.password)
      if (!isValidOldPassword) throw new AppError(401, 'Invalid Credentials Data')
    }

    const hashPassword = newPassword === undefined ? newPassword : await hashString(newPassword)
    const modifyUser = {
      ...body,
      password: hashPassword,
      active: literalToBoolean(active),
      updatedAt: new Date(),
      avatar
    }

    if (avatar != null) {
      const oldUser: GetMyUserType | null = await User.findById(userId)
        .select({ _id: 1, firstname: 1, lastname: 1, email: 1, role: 1, avatar: 1 })
        .lean()
        .exec()

      if (oldUser == null) throw new AppError(400, 'No user found')
      pathOldAvatar = oldUser.avatar
    }

    const user: ObjUserType | null = await User.findByIdAndUpdate(userId, modifyUser, { runValidators: true, new: true, context: 'query' })
      .select({ _id: 1, firstname: 1, lastname: 1, email: 1, role: 1, active: 1, updatedAt: 1, avatar: 1 })
      .lean()
      .exec()

    if (user == null) throw new AppError(400, 'No user found')
    if (avatar != null && pathOldAvatar != null) {
      const isExistFile = await fs.exists(path.resolve(pathOldAvatar))
      if (isExistFile) await fs.unlink(path.resolve(pathOldAvatar))
    }

    return user
  }

  /**
   * Endpoint to obtain the data of users from the database
   * @param active active users filter you want to get (true or false) (Optional)
   * @returns Data of all users with or without filters
   */
  @Security('adminAuth')
  @Get('/')
  public async getMultipleUser (
    @Query() active?: boolean
  ): Promise<GetMultipleUserType[]> {
    if (active === undefined) {
      const allUser: GetMultipleUserType[] = await User.find()
        .select({ _id: 1, firstname: 1, lastname: 1, email: 1, role: 1, active: 1, updatedAt: 1, avatar: 1 })
        .lean()
        .exec()

      return allUser
    } else {
      const activeUser: GetMultipleUserType[] = await User.find({ active })
        .select({ _id: 1, firstname: 1, lastname: 1, email: 1, role: 1, active: 1, updatedAt: 1, avatar: 1 })
        .lean()
        .exec()

      return activeUser
    }
  }

  /**
   * Endpoint to create an user in the database
   * @param body new user parameters (required)
   * @param avatar new user avatar (optional)
   * @returns Message informing if create was correct
   */
  @Security('adminAuth')
  @Post('/')
  public async createUser (
    @Body() body: CreateBodyUserType, @Request() avatar?: string
  ): Promise<MessageResType> {
    const { email, password } = body
    const duplicateEmail: ObjUserType | null = await User.findOne({ email: email.toLowerCase() })
      .select({ _id: 1, firstname: 1, lastname: 1, email: 1, role: 1, active: 1, updatedAt: 1, avatar: 1 })
      .lean()
      .exec()
    if (duplicateEmail != null) throw new AppError(400, 'Email is already registered')

    const hashPassword = await hashString(password)
    const newUser = {
      ...body,
      email: email.toLowerCase(),
      password: hashPassword,
      active: false,
      updatedAt: new Date(),
      avatar
    }
    await User.create(newUser)

    return { message: 'User create successfully' }
  }

  /**
   * Endpoint to partially update user information from the database
   * @param id identifier of the user to modify (required)
   * @param body parameters of the user to modify (optional)
   * @param avatar new avatar for user (optional)
   * @returns Message informing if update was correct
   */
  @Security('adminAuth')
  @Patch('/:id')
  public async updateUser (
    @Path() id: string, @Body() body: UpdateBodyUserType, @Request() avatar?: string
  ): Promise<MessageResType> {
    const { email, password, active } = body

    if (email != null) {
      const duplicateEmail: ObjUserType | null = await User.findOne({ email: email.toLowerCase() })
        .select({ _id: 1, firstname: 1, lastname: 1, email: 1, role: 1, active: 1, updatedAt: 1, avatar: 1 })
        .lean()
        .exec()
      if (duplicateEmail != null) throw new AppError(400, 'Email is already registered')
    }

    const hashPassword = password === undefined ? password : await hashString(password)
    const modifyUser = {
      ...body,
      email: email?.toLowerCase(),
      password: hashPassword,
      active: literalToBoolean(active),
      updatedAt: new Date(),
      avatar
    }
    const oldUser: ObjUserType | null = await User.findByIdAndUpdate(id, modifyUser, { runValidators: true, context: 'query' })
      .select({ _id: 1, firstname: 1, lastname: 1, email: 1, role: 1, active: 1, updatedAt: 1, avatar: 1 })
      .lean()
      .exec()

    if (oldUser == null) throw new AppError(400, 'No user found')
    if (avatar != null && oldUser.avatar != null) {
      const isExistFile = await fs.exists(path.resolve(oldUser.avatar))
      if (isExistFile) await fs.unlink(path.resolve(oldUser.avatar))
    }
    return { message: 'User update successfully' }
  }

  /**
   * Endpoint to delete an user from the database
   * @param id identifier of the user to delete (required)
   * @returns Message informing if delete was correct
   */
  @Security('adminAuth')
  @Delete('/:id')
  public async deleteUser (
    @Path() id: string
  ): Promise<MessageResType> {
    const user: ObjUserType | null = await User.findByIdAndDelete(id)
      .select({ _id: 1, firstname: 1, lastname: 1, email: 1, role: 1, active: 1, updatedAt: 1, avatar: 1 })
      .lean()
      .exec()

    if (user == null) throw new AppError(400, 'No user found')
    if (user.avatar != null) {
      const isExistFile = await fs.exists(path.resolve(user.avatar))
      if (isExistFile) await fs.unlink(path.resolve(user.avatar))
    }
    return { message: 'User delete successfully' }
  }
}
