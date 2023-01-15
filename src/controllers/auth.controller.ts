import { compareWithHash, hashString } from '../libs/bcrypt'
import { Route, Tags, Post, Body } from 'tsoa'
import { UserRole } from '../enums/userRole.enum'
import { createAccessToken, createRefreshToken, decodedToken } from '../libs/jwt'
import User from '../models/user.model'
import { AppError } from '../utils/appError.class'
import { TUserCreate } from './types/index'
import { LoginBodyAuthType, RegisterBodyAuthType } from '../schemas/auth.schema'
import { TokenType } from '../enums/tokenType.enum'

@Route('/auth')
@Tags('AuthController')
export class AuthController {
  /**
   * Endpoint to create new user in database
   * @param body new user parameters (required)
   * @returns Message informing if create was correct
   */
  @Post('/register')
  public async registerUser (@Body() body: RegisterBodyAuthType) {
    const { firstname, lastname, email, password } = body
    const hashPassword = await hashString(password)
    const user: TUserCreate = {
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: hashPassword,
      role: UserRole.USER,
      active: false
    }

    await User.create(user)
    return { message: 'User create successfully' }
  }

  /**
   * Endpoint to auth with login a user in database
   * @param body credentials of the user to log in (required)
   * @returns Message with jwt access token and jwt refresh token
   */
  @Post('/login')
  public async loginUser (@Body() body: LoginBodyAuthType) {
    const { email, password } = body
    const emailLowerCase = email.toLowerCase()

    const userFound = await User.findOne({ email: emailLowerCase }).exec()
    if (userFound == null) throw new AppError(500, 'Server Login Error')

    const isValidPassword = await compareWithHash(password, userFound.password)
    if (!isValidPassword) throw new AppError(500, 'Server Login Error')
    if (!userFound.active) throw new AppError(401, 'Unauthorized User Error')

    return {
      accessToken: createAccessToken(userFound._id),
      refreshToken: createRefreshToken(userFound._id)
    }
  }

  /**
   * Endpoint to refresh the token of a previously logged in user
   * @param refreshToken Valid Refresh token
   * @returns Message with a new jwt access token
   */
  @Post('/refresh')
  public async refreshAccessToken (@Body() refreshToken: string) {
    const payloadToken = decodedToken(refreshToken)
    if (typeof payloadToken === 'string' || payloadToken.userId == null || payloadToken.type == null || payloadToken.type !== TokenType.REFRESH) {
      throw new AppError(400, 'Invalid Token Error')
    }

    const user = await User.findOne({ _id: payloadToken.userId }).exec()
    if (user == null) throw new AppError(400, 'Invalid Token Error')

    return { accessToken: createAccessToken(user._id) }
  }
}
