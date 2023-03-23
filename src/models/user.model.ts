import { model, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { UserRole } from '../enums/userRole.enum'

export interface IUser {
  firstname: string
  lastname: string
  email: string
  password: string
  role: UserRole
  active: boolean
  updatedAt: Date
  avatar?: string
}

const userSchema = new Schema<IUser>({
  firstname: { type: String, trim: true, minlength: 3, required: true },
  lastname: { type: String, trim: true, minlength: 3, required: true },
  email: { type: String, lowercase: true, trim: true, required: true, unique: true, uniqueCaseInsensitive: true },
  password: { type: String, minlength: 6, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  active: { type: Boolean, required: true },
  updatedAt: { type: Date, required: true },
  avatar: { type: String, trim: true, index: false, unique: false, uniqueCaseInsensitive: false }
})
userSchema.plugin(uniqueValidator)

export default model<IUser>('User', userSchema)
