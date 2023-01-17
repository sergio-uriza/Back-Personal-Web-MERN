import { Route, Tags, Get, Security, Request, Query, Post, Patch, Delete, Path, Body } from 'tsoa'
import { literalToBoolean } from '../enums/literalsBoolean.enum'
import { hashString } from '../libs/bcrypt'
import User from '../models/user.model'
import { CreateBodyUserType, UpdateBodyUserType } from '../schemas/user.schema'
import { ObjUserType } from './types/index'

@Route('/user')
@Tags('UserController')
export class UserController {
  /**
   * Endpoint to obtain the data of the user making the request
   * @param userId id of the user contained in the access token (required)
   * @returns Data of the user making the request
   */
  @Security('bearerAuth')
  @Get('/me')
  public async getMe (@Request() userId: string) {
    const me: ObjUserType | null = await User.findById(userId)
      .select({ _id: 0, firstname: 1, lastname: 1, email: 1 })
      .lean()
      .exec()

    return me
  }

  /**
   * Endpoint to obtain the data of users from database
   * @param active active users filter you want to get (true or false) (Optional)
   * @returns Data of all users with or without filters
   */
  @Security('bearerAuth')
  @Get('/')
  public async getUsers (@Query() active?: boolean) {
    if (active === undefined) {
      const allUser: ObjUserType[] = await User.find()
        .select({ firstname: 1, lastname: 1, email: 1, role: 1, active: 1, avatar: 1 })
        .lean()
        .exec()
      return allUser
    } else {
      const activeUser: ObjUserType[] = await User.find({ active })
        .select({ firstname: 1, lastname: 1, email: 1, role: 1, active: 1, avatar: 1 })
        .lean()
        .exec()
      return activeUser
    }
  }

  /**
   * Endpoint to create users in datatbase
   * @param body new user parameters (required)
   * @param avatar new user avatar (optional)
   * @returns Message informing if create was correct
   */
  @Security('bearerAuth')
  @Post('/')
  public async createUser (@Body() body: CreateBodyUserType, @Request() avatar?: string) {
    const { password, email } = body
    const hashPassword = await hashString(password)
    await User.create({
      ...body,
      email: email.toLowerCase(),
      password: hashPassword,
      active: false,
      avatar
    })

    return { message: 'User create successfully' }
  }

  /**
   * Endpoint to partially update user information from the database
   * @param id identifier of the user to modify (required)
   * @param body parameters of the user to modify (optional)
   * @param avatar new avatar for user (optional)
   * @returns Message informing if update was correct
   */
  @Security('bearerAuth')
  @Patch('/:id')
  public async updateUser (@Path() id: string, @Body() body: UpdateBodyUserType, @Request() avatar?: string) {
    const { email, password, active } = body
    const hashPassword = password === undefined ? password : await hashString(password)

    const modifyUser = {
      ...body,
      email: email?.toLowerCase(),
      password: hashPassword,
      active: literalToBoolean(active),
      avatar
    }

    await User.findByIdAndUpdate(id, modifyUser, { runValidators: true, new: true }).exec()
    return { message: 'User update successfully' }
  }

  /**
   * Endpoint to delete a user from the database
   * @param id identifier of the user to delete (required)
   * @returns Message informing if delete was correct
   */
  @Security('bearerAuth')
  @Delete('/:id')
  public async deleteUser (@Path() id: string) {
    await User.findByIdAndDelete(id).exec()
    return { message: 'User delete successfully' }
  }
}
