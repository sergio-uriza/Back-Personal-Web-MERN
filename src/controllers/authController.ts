import bcrypt from 'bcryptjs';
import { Controller, Route, Tags, Post, BodyProp, Body } from 'tsoa';
import { userEntity } from '../models/entities/user.entity';
import { UserRole } from '../utils/userRole.enum';
import { createAccessToken, createRefreshToken, decodedToken } from '../libs/jwt';
import { IUser } from './interface/IUser.interface';
import { TUserSearch } from './types/auth.type';


const userModel = userEntity(); // Users Collection

@Route("/auth")
@Tags("AuthController")
export class AuthController extends Controller {

  /**
   * Endpoint to create new user in database
   * @param firstname new user name (required)
   * @param lastname new user's last name (required)
   * @param email new user email (required)
   * @param password new user password (required)
   * @returns Message informing if create was correct
   */
  @Post("/register")
  public async registerUser(@BodyProp() firstname: string, @BodyProp() lastname: string, @BodyProp() email:string, @BodyProp() password:string): Promise<any> {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      const user: IUser = {
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: hashPassword,
        role: UserRole.USER,
        active: false,
        avatar: ''
      };
      
      await userModel.create(user);
      return { msg: 'User create successfully' }
      
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
  public async loginUser(@BodyProp() email: string, @BodyProp() password: string): Promise<any> {
    try {
      const emailLowerCase = email.toLowerCase();
      
      const userFound: TUserSearch | null = await userModel.findOne({ email: emailLowerCase }).exec();
      if (!userFound) throw new Error('loginError');

      const isValidPassword = await bcrypt.compare(password, userFound.password);
      if (!isValidPassword) throw new Error('loginError');
      if (!userFound.active) throw new Error('unauthorizedError');

      return {
        msg: 'Login successfully',
        access: createAccessToken(userFound._id),
        refresh: createRefreshToken(userFound._id)
      }
      
    } catch (err) {
      console.log(`[ORM ERROR]: Login user: ${err}`);
      throw err;
    }
  }

  /**
   * Endpoint to refresh the token of a previously logged in user
   * @param token Valid Refresh token
   * @returns Message with a new jwt access token
   */
  @Post("/refresh")
  public async refreshAccessToken(@Body() token: string): Promise<any> {
    try {
      const payloadToken = decodedToken(token);
      if (typeof payloadToken === 'string' || !payloadToken.userId || payloadToken.type !== 'refresh') throw new Error('tokenError');

      const user: TUserSearch | null = await userModel.findOne({ _id: payloadToken.userId }).exec();
      if (!user) throw new Error('tokenError');

      return {
        msg: 'Refresh Access Token successfully',
        access: createAccessToken(user._id),
      }
      
    } catch (err) {
      console.log(`[ORM ERROR]: Refresh access token: ${err}`);
      throw err;
    }
  }
}
