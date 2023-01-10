import bcrypt from 'bcryptjs';
import { Route, Tags, Get, Security, Request, Query, Post, BodyProp } from 'tsoa';
import { UserRole } from '../enums/userRole.enum';
import User from '../models/user.model'
import { TUserCreate } from './types/index';

@Route("/users")
@Tags("UserController")
export class UserController {

  /**
   * Endpoint to obtain the data of the user making the request
   * @param userId id of the user contained in the access token (required)
   * @returns Data of the user making the request
   */
  @Security("bearerAuth")
  @Get("/me")
  public async getMe(@Request() userId: string) {
    try {
      return await User.findById(userId)
        .select({_id: 0, firstname: 1, lastname: 1, email: 1})
        .exec();

    } catch (err) {
      console.log(`[ORM ERROR]: Get me: ${err}`);
      throw err;
    }
  }

  /**
   * Endpoint to obtain the data of users from datatbase
   * @param active active users filter you want to get (true or false) (Optional)
   * @returns Information of all users with or without filters
   */
  @Security("bearerAuth")
  @Get("/")
  public async getUsers(@Query() active?: boolean) {
    try {
      if ( active === undefined ) {
        return await User.find()
          .select({ firstname: 1, lastname: 1, email: 1, role: 1, active: 1, avatar: 1 })
          .exec();
      } else {
        return await User.find({ active })
          .select({ firstname: 1, lastname: 1, email: 1, role: 1, active: 1, avatar: 1 })
          .exec();
      }

    } catch (err) {
      console.log(`[ORM ERROR]: Get all users: ${err}`);
      throw err;
    }
  }

  /**
   * Endpoint to obtain the data of users from datatbase
   * @param active active users filter you want to get (true or false) (Optional)
   * @returns Information of all users with or without filters
   */
  @Security("bearerAuth")
  @Post("/")
  public async createUser(@BodyProp() firstname: string, @BodyProp() lastname: string, @BodyProp() email: string, @BodyProp() password: string, @BodyProp() role: UserRole, @Request() avatar?: string) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      const ImagePath = avatar ? avatar : '';
      const user: TUserCreate = {
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: hashPassword,
        role,
        active: false,
        avatar: ImagePath
      };
      
      await User.create(user);
      return { message: 'User create successfully' }

    } catch (err) {
      console.log(`[ORM ERROR]: Create user: ${err}`);
      throw err;
    }
  }
}
