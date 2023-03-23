import User from '../models/user.model'
import { Route, Tags, Post, Body } from 'tsoa'
import { UserRole } from '../enums/userRole.enum'
import { AppError } from '../utils/appError.class'
import { TokenType } from '../enums/tokenType.enum'
import { compareWithHash, hashString } from '../libs/bcrypt'
import { createAccessToken, createRefreshToken, decodedRefToken } from '../libs/jwt'
import { LoginBodyAuthType, RefreshBodyAuthType, RegisterBodyAuthType } from '../schemas/auth.schema'
import { LoginUserType, MessageResType, ObjUserType, RefreshAccessTokenType } from './types'

@Route('/auth')
@Tags('Auth Endpoint')
export class AuthController {
  /**
   * Endpoint to create new user in database
   * @param body new user parameters (required)
   * @returns Message informing if create was correct
   */
  @Post('/register')
  public async registerUser (
    @Body() body: RegisterBodyAuthType
  ): Promise<MessageResType> {
    const { email, password } = body
    const duplicateEmail: ObjUserType | null = await User.findOne({ email: email.toLowerCase() })
      .lean()
      .exec()
    if (duplicateEmail != null) throw new AppError(400, 'Email is already registered')

    const hashPassword = await hashString(password)
    const newUser = {
      ...body,
      email: email.toLowerCase(),
      password: hashPassword,
      role: UserRole.USER,
      updatedAt: new Date(),
      active: true
    }
    await User.create(newUser)

    return { message: 'User create successfully' }
  }

  /**
   * Endpoint to auth with login a user in database
   * @param body credentials of the user to login (required)
   * @returns Message with access token and refresh token
   */
  @Post('/login')
  public async loginUser (
    @Body() body: LoginBodyAuthType
  ): Promise<LoginUserType> {
    const { email, password } = body
    const emailLowerCase = email.toLowerCase()

    const userFound: ObjUserType | null = await User.findOne({ email: emailLowerCase })
      .lean()
      .exec()
    if (userFound == null) throw new AppError(401, 'Server Login Error')

    const isValidPassword = await compareWithHash(password, userFound.password)
    if (!isValidPassword) throw new AppError(401, 'Server Login Error')
    if (!userFound.active) throw new AppError(403, 'Unauthorized User Error')

    return {
      accessToken: createAccessToken(userFound._id.toString()),
      refreshToken: createRefreshToken(userFound._id.toString())
    }
  }

  /**
   * Endpoint to auth with login an admin user in database
   * @param body credentials of the admin user to login (required)
   * @returns Message with access token and refresh token
   */
  @Post('/login_admin')
  public async loginAdmin (
    @Body() body: LoginBodyAuthType
  ): Promise<LoginUserType> {
    const { email, password } = body
    const emailLowerCase = email.toLowerCase()

    const userFound: ObjUserType | null = await User.findOne({ email: emailLowerCase })
      .lean()
      .exec()
    if (userFound == null) throw new AppError(401, 'Server Login Error')

    const isValidPassword = await compareWithHash(password, userFound.password)
    if (!isValidPassword) throw new AppError(401, 'Server Login Error')
    if (!userFound.active) throw new AppError(403, 'Unauthorized User Error')
    if (userFound.role !== UserRole.ADMIN) throw new AppError(403, 'Unauthorized User Error')

    return {
      accessToken: createAccessToken(userFound._id.toString()),
      refreshToken: createRefreshToken(userFound._id.toString())
    }
  }

  /**
   * Endpoint to refresh the token of a previously loggedin user
   * @param body Valid Refresh token
   * @returns Message with a new access token
   */
  @Post('/refresh')
  public async refreshAccessToken (
    @Body() body: RefreshBodyAuthType
  ): Promise<RefreshAccessTokenType> {
    const { refreshToken } = body
    const payloadToken = decodedRefToken(refreshToken)
    if (
      typeof payloadToken === 'string' ||
      payloadToken.userId == null ||
      payloadToken.type == null ||
      payloadToken.type !== TokenType.REFRESH
    ) {
      throw new AppError(400, 'Invalid Token Error')
    }

    const user: ObjUserType | null = await User.findOne({ _id: payloadToken.userId })
      .lean()
      .exec()
    if (user == null) throw new AppError(400, 'Invalid Token Error')

    return { accessToken: createAccessToken(user._id.toString()) }
  }
}
