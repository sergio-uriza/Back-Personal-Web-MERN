import { model, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export interface IMenu {
  title: string
  path: string
  order: number
  active: boolean
}

const menuSchema = new Schema<IMenu>(
  {
    title: { type: String, trim: true, minlength: 1, required: true, unique: true },
    path: { type: String, trim: true, minlength: 1, lowercase: true, required: true, unique: true, uniqueCaseInsensitive: true },
    order: { type: Number, required: true, unique: true },
    active: { type: Boolean, required: true }
  }
)
menuSchema.plugin(uniqueValidator)

export default model<IMenu>('Menu', menuSchema)
