import { Schema, model } from 'mongoose';

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 4 },
});

export default model('user', UserSchema);
