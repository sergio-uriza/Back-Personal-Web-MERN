import { model, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export interface INewsletter {
  email: string
}

const newsletterSchema = new Schema<INewsletter>({
  email: { type: String, lowercase: true, trim: true, required: true, unique: true, uniqueCaseInsensitive: true }
})
newsletterSchema.plugin(uniqueValidator)

export default model<INewsletter>('Newsletter', newsletterSchema)
