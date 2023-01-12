import { model, Schema, Document } from 'mongoose';

export interface IMenu extends Document {
  title: string,
  path: string,
  order: number,
  active: boolean,
}

const menuSchema = new Schema<IMenu>(
  {
    title: {type: String, required: true},
    path: {type: String, required: true},
    order: {type: Number, required: true},
    active: {type: Boolean, required: true},
  }
)

export default model<IMenu>('Model', menuSchema);
