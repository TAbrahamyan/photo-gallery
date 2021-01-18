import { Schema, model } from 'mongoose';
import { IUser } from '../../interfaces';

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
    validate: {
      validator: v => /[^\w -]+/g.test(v),
      message: 'Word range 3-20 and must not contain special symbols.',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/g.test(v),
      message: 'Invalid email',
    },
  },
  password: { type: String, required: true, minlength: 3 },
  photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }],
}, { timestamps: true });

export default model<IUser>('User', UserSchema);
