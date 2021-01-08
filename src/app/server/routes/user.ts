import { Router } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import checkAuth from '../middleware/checkAuth';
import { signupValidation, loginValidation } from '../middleware/validations';

const router = Router();

router.post('/signup', signupValidation, async (req, res) => {
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

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ message: 'Successful registration' });
  } catch {
    res.status(500).send('Error in saving');
  }
});

router.post('/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user: any = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Incorrect password or email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password or email' });
    }

    const token = jwt.sign(
      { userId: user.id },
      'secret',
      { expiresIn: 3600 },
    );

    res.status(200).json({ token });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', checkAuth, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json(user);
  } catch {
    res.send({ message: 'Error in fetching user' });
  }
});

export default router;
