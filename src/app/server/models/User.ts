import { Document, Schema, model } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  photos: string[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 4 },
  photos: { type: Array },
});

export default model<IUser>('user', UserSchema);
