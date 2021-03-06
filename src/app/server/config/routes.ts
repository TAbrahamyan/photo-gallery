import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import config from './config';
import { UserController, PhotoController } from '../controllers';
import { checkAuth, signupValidation, loginValidation } from '../middleware';
import { Express } from 'express-serve-static-core';

export const createRoutes = (app: Express) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // User Api
  app.post('/api/user/signup', signupValidation, UserController.signup);
  app.post('/api/user/login', loginValidation, UserController.login);
  app.get('/api/user/me', checkAuth, UserController.me);
  app.patch('/api/user/edit-username', UserController.editUsername);
  app.delete('/api/user/:id', UserController.delete);

  // Photo Api
  app.post('/api/photo/upload', checkAuth, PhotoController.upload);
  app.get('/api/photo/photos', checkAuth, PhotoController.photos);
  app.delete('/api/photo/:id', PhotoController.delete);
  app.patch('/api/photo/bulk-delete', PhotoController.bulkDelete);

  if (config.isProduction) {
    app.use(express.static(path.join(__dirname, '../../../../dist/photo-gallery')));

    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../../../dist/photo-gallery/index.html'))
    });
  }
};
