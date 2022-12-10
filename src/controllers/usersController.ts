import bcrypt from 'bcryptjs';
import { Controller, Route, Tags, Get, Security, Request, Query, Post, BodyProp } from 'tsoa';
import { userEntity } from '../models/entities/user.entity';
import { UserRole } from '../utils/userRole.enum';
import { IUser } from './interface/IUser.interface';


const userModel = userEntity(); // Users Collection

@Route("/users")
@Tags("UserController")
export class UserController extends Controller {

  /**
   * Endpoint to obtain the data of the user making the request
   * @param userId id of the user contained in the access token (required)
   * @returns Data of the user making the request
   */
  @Security("bearerAuth")
  @Get("/me")
  public async getMe(@Request() userId: string): Promise<any> {
    try {
      return await userModel.findById(userId)
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
  public async getUsers(@Query() active?: boolean): Promise<any> {
    try {
      if ( active === undefined ) {
        return await userModel.find()
          .select({ firstname: 1, lastname: 1, email: 1, role: 1, active: 1, avatar: 1 })
          .exec();
      } else {
        return await userModel.find({ active })
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
  public async createUser(@BodyProp() firstname: string, @BodyProp() lastname: string, @BodyProp() email: string, @BodyProp() password: string, @BodyProp() role: UserRole, @Request() avatar?: string): Promise<any> {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      const ImagePath = avatar ? avatar : '';
      const user: IUser = {
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: hashPassword,
        role,
        active: false,
        avatar: ImagePath
      };
      
      await userModel.create(user);
      return { msg: 'User create successfully' }

    } catch (err) {
      console.log(`[ORM ERROR]: Create user: ${err}`);
      throw err;
    }
  }
}
