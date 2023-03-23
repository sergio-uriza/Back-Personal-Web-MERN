import { model, Schema, Types } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export interface IBlog {
  title: string
  content: string
  path: string
  user: Types.ObjectId
  createdAt: Date
  miniature?: string
}

const blogSchema = new Schema<IBlog>({
  title: { type: String, trim: true, minlength: 5, required: true },
  content: { type: String, trim: true, minlength: 5, required: true },
  path: { type: String, trim: true, minlength: 1, required: true, unique: true, uniqueCaseInsensitive: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, required: true },
  miniature: { type: String, trim: true, minlength: 1, index: false, unique: false, uniqueCaseInsensitive: false }
})
blogSchema.plugin(uniqueValidator)

export default model<IBlog>('Blog', blogSchema)
