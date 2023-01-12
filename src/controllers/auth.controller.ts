import { compareWithHash, hashString } from '../libs/bcrypt';
import { Route, Tags, Post, BodyProp, Body } from 'tsoa';
import { UserRole } from '../enums/userRole.enum';
import { createAccessToken, createRefreshToken, decodedToken } from '../libs/jwt';
import User from '../models/user.model'
import { AppError } from '../utils/appError.class';
import { TUserCreate } from './types/index';

@Route("/auth")
@Tags("AuthController")
export class AuthController {

  /**
   * Endpoint to create new user in database
   * @param firstname new user name (required)
   * @param lastname new user's last name (required)
   * @param email new user email (required)
   * @param password new user password (required)
   * @returns Message informing if create was correct
   */
  @Post("/register")
  public async registerUser(@BodyProp() firstname: string, @BodyProp() lastname: string, @BodyProp() email:string, @BodyProp() password:string) {
    try {
      const hashPassword = await hashString(password);
      const user: TUserCreate = {
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: hashPassword,
        role: UserRole.USER,
        active: false
      };
      
      await User.create(user);
      return { message: 'User create successfully' }
      
    } catch (err) {
      console.log(`[ORM ERROR]: Registering user: ${err}`);
      throw err;
    }
  }

  /**
   * Endpoint to auth with login a user in database
   * @param email email of the user to log in (required)
   * @param password password of the user to log in (required)
   * @returns Message with jwt access token and jwt refresh token
   */
  @Post("/login")
  public async loginUser(@BodyProp() email: string, @BodyProp() password: string) {
    try {
      const emailLowerCase = email.toLowerCase();
      
      const userFound = await User.findOne({ email: emailLowerCase }).exec();
      if (!userFound) throw new AppError(500, 'Server Login Error');

      const isValidPassword = await compareWithHash(password, userFound.password);
      if (!isValidPassword) throw new AppError(500, 'Server Login Error');
      if (!userFound.active) throw new AppError(401, 'Unauthorized User Error');

      return {
        accessToken: createAccessToken(userFound._id),
        refreshToken: createRefreshToken(userFound._id)
      }
      
    } catch (err) {
      console.log(`[ORM ERROR]: Login user: ${err}`);
      throw err;
    }
  }

  /**
   * Endpoint to refresh the token of a previously logged in user
   * @param refreshToken Valid Refresh token
   * @returns Message with a new jwt access token
   */
  @Post("/refresh")
  public async refreshAccessToken(@Body() refreshToken: string) {
    try {
      const payloadToken = decodedToken(refreshToken);
      if (!payloadToken.userId || payloadToken.type !== 'refresh') throw new AppError(400, 'Invalid Token Error');

      const user = await User.findOne({ _id: payloadToken.userId }).exec();
      if (!user) throw new AppError(400, 'Invalid Token Error');

      return { accessToken: createAccessToken(user._id) }
      
    } catch (err) {
      console.log(`[ORM ERROR]: Refresh access token: ${err}`);
      throw err;
    }
  }
}
