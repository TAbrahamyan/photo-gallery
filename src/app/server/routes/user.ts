import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

import User from '../models/User';
import auth from '../middleware/auth';

const router = Router();

router.post('/register', [
  check('username').not().isEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Password minimum length is 4').isLength({ min: 4 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User with same email already exists' });
    }

    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'User with same username already exists' });
    }

    const user: any = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      'randomString',
      { expiresIn: 10000 },
      (e: Error, token: string): void => {
        if (e) {
          throw e;
        }

        res.status(200).json({ token, message: 'Successful registration' });
      },
    );

    await user.save();
  } catch (e) {
    console.error('Error: ', e);
    res.status(500).send('Error in saving');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user: any = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not exists' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      'secret',
      { expiresIn: 3600 },
      (e: Error, token: string): void => {
        if (e) {
          throw e;
        }

        res.status(200).json({ token });
      },
    );
  } catch (e) {
    console.error('Error: ', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// router.get('/me', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.body.id);
//     res.json(user);
//   } catch (e) {
//     res.send({ message: 'Error in fetching user' });
//   }
// });

export default router;
