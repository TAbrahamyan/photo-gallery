import { Document } from 'mongoose';

// Server interfaces
export interface IPhoto extends Document {
  owner: string;
  src: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  photos: any;
}

export interface IConfig {
  isProduction: boolean;
  port: string | number;
  db: string;
  secretJWT: string;
}
// Server interfaces

// Client interfaces
export interface IInputsConfig {
  type: string;
  label: string;
  controlName: string;
  validationText: string;
}

export interface IPhotos {
  _id: string;
  _v: number;
  owner: string;
  src: string;
  createdAt: string;
  updatedAt: string;
}
// Client interfaces
