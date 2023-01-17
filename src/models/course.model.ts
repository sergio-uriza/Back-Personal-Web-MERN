import { model, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export interface ICourse {
  title: string
  description: string
  url: string
  price: number
  score: number
  miniature?: string
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, trim: true, minlength: 1, required: true },
    description: { type: String, trim: true, minlength: 1, required: true },
    url: { type: String, trim: true, minlength: 1, lowercase: true, required: true, unique: true, uniqueCaseInsensitive: true },
    price: { type: Number, required: true },
    score: { type: Number, required: true },
    miniature: { type: String, trim: true, minlength: 1, lowercase: true, unique: true }
  }
)
courseSchema.plugin(uniqueValidator)

export default model<ICourse>('Course', courseSchema)
