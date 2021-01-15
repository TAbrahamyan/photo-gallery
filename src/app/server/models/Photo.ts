import { Schema, model } from 'mongoose';
import { IPhoto } from '../../interfaces';

const PhotoSchema: Schema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  src: String,
}, { timestamps: true });

export default model<IPhoto>('Photo', PhotoSchema);
