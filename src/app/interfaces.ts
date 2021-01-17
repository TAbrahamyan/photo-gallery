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
  photos: IPhotos;
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

export interface IFrontUser {
  _v: number;
  _id: string;
  email: string;
  username: string;
  password: string;
  photos: IPhotos;
  createdAt: string;
  updatedAt: string;
}

export interface IPhotos {
  _v: number;
  _id: string;
  owner: string;
  src: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISelectedPhotos {
  photoId: string;
  photoLink: string;
  photoName: string;
}
// Client interfaces
