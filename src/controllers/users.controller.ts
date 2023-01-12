import { Route, Tags, Get, Security, Request, Query, Post, Patch, Delete, BodyProp, Path } from 'tsoa';
import { UserRole } from '../enums/userRole.enum';
import { hashString } from '../libs/bcrypt';
import User from '../models/user.model'
import { TUserCreate, TUserUpdate } from './types/index';

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
   * Endpoint to create users in datatbase
   * @param firstname new user name (required)
   * @param lastname new user's last name (required)
   * @param email new user email (required)
   * @param password new user password (required)
   * @param role new user role (required)
   * @param avatar new user avatar (optional)
   * @returns Message informing if create was correct
   */
  @Security("bearerAuth")
  @Post("/")
  public async createUser(@BodyProp() firstname: string, @BodyProp() lastname: string, @BodyProp() email: string, @BodyProp() password: string, @BodyProp() role: UserRole, @Request() avatar?: string) {
    try {
      const hashPassword = await hashString(password);
      const user: TUserCreate = {
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: hashPassword,
        role,
        active: false,
        avatar
      };
      
      await User.create(user);
      return { message: 'User create successfully' };

    } catch (err) {
      console.log(`[ORM ERROR]: Create user: ${err}`);
      throw err;
    }
  }

  /**
   * Endpoint to partially update user information from the database
   * @param id identifier of the user to modify (required)
   * @param firstname new firstname for user (optional)
   * @param lastname new lastname for user (optional)
   * @param email new email for user (optional)
   * @param password new password for user (optional)
   * @param role new role for user (optional)
   * @param active new state of active for user (optional)
   * @param avatar new avatar for user (optional)
   * @returns Message informing if update was correct
   */
  @Security("bearerAuth")
  @Patch("/:id")
  public async updateUser(@Path() id: string, @BodyProp() firstname?: string, @BodyProp() lastname?: string, @BodyProp() email?: string, @BodyProp() password?: string, @BodyProp() role?: UserRole, @BodyProp() active?: boolean, @Request() avatar?: string) {
    const hashPassword = password === undefined ? password : await hashString(password)
    try {
      const user: TUserUpdate = {
        firstname,
        lastname,
        email: email?.toLowerCase(),
        password: hashPassword,
        role,
        active,
        avatar
      };
      
      await User.findByIdAndUpdate(id, user, { runValidators: true });
      return { message: 'User update successfully' };

    } catch (err) {
      console.log(`[ORM ERROR]: Partial update user: ${err}`);
      throw err;
    }
  }

  /**
   * Endpoint to delete a user from the database
   * @param id identifier of the user to delete (required)
   * @returns Message informing if delete was correct
   */
  @Security("bearerAuth")
  @Delete("/:id")
  public async deleteUser(@Path() id: string) { 
    try {     
      await User.findByIdAndDelete(id)
      return { message: 'User delete successfully' };

    } catch (err) {
      console.log(`[ORM ERROR]: Partial update user: ${err}`);
      throw err;
    }
  }
}
