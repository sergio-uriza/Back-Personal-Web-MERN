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

const courseSchema = new Schema<ICourse>({
  title: { type: String, trim: true, minlength: 5, required: true },
  description: { type: String, trim: true, minlength: 5, required: true },
  url: { type: String, trim: true, minlength: 3, required: true, unique: true, uniqueCaseInsensitive: true },
  price: { type: Number, required: true, index: false, unique: false },
  score: { type: Number, required: true, index: false, unique: false },
  miniature: { type: String, trim: true, minlength: 3, index: false, unique: false, uniqueCaseInsensitive: false }
})
courseSchema.plugin(uniqueValidator)

export default model<ICourse>('Course', courseSchema)
