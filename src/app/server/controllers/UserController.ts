import { Request, Response } from 'express';
import User from '../models/User';
import Photo from '../models/Photo';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { validationResult } from 'express-validator';

export class UserController {
  static async signup(req: Request, res: Response): Promise<any> {
    const { username, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (await User.findOne({ email })) {
        return res.status(400).json({ message: 'User with same email already exists' });
      }

      if (await User.findOne({ username })) {
        return res.status(400).json({ message: 'User with same username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      res.status(200).json('Successful registration');
    } catch (e) {
      console.log(e);
      res.status(500).send('Error in saving');
    }
  }

  static async login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Incorrect password or email' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password or email' });
      }

      const token = jwt.sign(
        { userId: user.id },
        config.secretJWT,
        { expiresIn: '1h' },
      );

      res.status(200).json(token);
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async me(req: any, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.userId);
      res.status(200).json(user);
    } catch {
      res.status(401).json({ message: 'Error in fetching user' });
    }
  }

  static async editUsername(req: Request, res: Response): Promise<void> {
    try {
      await User.findByIdAndUpdate(
        { _id: req.body.id },
        { $set: { username: req.body.newUsername } },
        { new: true },
      );
      res.status(200).json({ message: 'Username is eddited' });
    } catch {
      res.status(500).json({ message: 'Error on editing' });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      await User.findByIdAndRemove(req.params.id);
      await Photo.deleteMany({ owner: req.params.id });
      res.status(200).json({ message: `User succesfully deleted` });
    } catch {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
}
