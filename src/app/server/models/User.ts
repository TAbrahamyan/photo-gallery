import { Schema, model } from 'mongoose';
import { IUser } from '../../interfaces';

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 4 },
  photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }],
}, { timestamps: true });

export default model<IUser>('User', UserSchema);
