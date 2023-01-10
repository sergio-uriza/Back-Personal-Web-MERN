import { model, Schema, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { UserRole } from '../enums/userRole.enum';

export interface IUser extends Document {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  role: string,
  active: boolean,
  avatar?: string,
}

const userSchema = new Schema<IUser>(
  {
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, lowercase: true, trim: true, required: true, unique: true, uniqueCaseInsensitive: true},
    password: {type: String, required: true},
    role: {type: String, enum: Object.values(UserRole), required: true},
    active: {type: Boolean, required: true},
    avatar: {type: String}
  }
)
userSchema.plugin(uniqueValidator)

export default model<IUser>('User', userSchema);

