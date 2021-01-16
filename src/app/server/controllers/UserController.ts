import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { validationResult } from 'express-validator';

export class UserController {
  static async signup(req, res): Promise<void> {
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
    } catch {
      res.status(500).send('Error in saving');
    }
  }

  static async login(req, res): Promise<void> {
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

  static async me(req, res): Promise<void> {
    try {
      const user = await User.findById(req.userId);
      res.status(200).json(user);
    } catch {
      res.status(401).json({ message: 'Error in fetching user' });
    }
  }
}
