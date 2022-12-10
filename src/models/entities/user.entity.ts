import mongoose, { Schema } from 'mongoose';
import { IUserSchema } from '../interfaces/IUserSchema.interface';
import uniqueValidator from 'mongoose-unique-validator';
import { UserRole } from '../../utils/userRole.enum';

export const userEntity = () => {

  const userSchema = new mongoose.Schema<IUserSchema>(
    {
      firstname: {type: String, required: true},
      lastname: {type: String, required: true},
      email: {type: String, required: true, unique: true, uniqueCaseInsensitive: true},
      password: {type: String, required: true},
      role: {type: String, enum: Object.values(UserRole), required: true},
      active: {type: Boolean, required: true},
      avatar: {type: String}
    }
  )
  userSchema.plugin(uniqueValidator)

  return mongoose.models.users || mongoose.model<IUserSchema>('users', userSchema);
}
