import express from 'express';
import cors from 'cors';

import checkAuth from '../middleware/checkAuth';
import { PhotoController } from '../controllers/PhotoController';
import { UserController } from '../controllers/UserController';
import { signupValidation, loginValidation } from '../middleware/validations';

export const createRoutes = app => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // User Auth
  app.post('/api/user/signup', signupValidation, UserController.signup);
  app.post('/api/user/login', loginValidation, UserController.login);
  app.get('/api/user/me', checkAuth, UserController.me);
  // User Auth

  // Photo Api
  app.post('/api/photo/upload', checkAuth, PhotoController.upload);
  app.get('/api/photo/photos', checkAuth, PhotoController.photos);
  app.delete('/api/photo/:id', PhotoController.delete);
  app.patch('/api/photo/bulk-delete', PhotoController.bulkDelete);
  // Photo Api
};
