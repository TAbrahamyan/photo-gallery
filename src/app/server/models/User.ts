import { Schema, model } from 'mongoose';
import { IUser } from '../../interfaces';

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true, minlength: 3, maxlength: 20 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 3 },
  photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }],
}, { timestamps: true });

export default model<IUser>('User', UserSchema);
