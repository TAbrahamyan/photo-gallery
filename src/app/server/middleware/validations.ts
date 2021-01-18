import { check } from 'express-validator';

export const signupValidation = [
  check('username').notEmpty().isLength({ min: 3, max: 20 }),
  check('email', 'Invalid email').isEmail(),
  check('password', 'Minimum length is 3').isLength({ min: 3 }),
];

export const loginValidation = [
  check('email', 'Invalid email').normalizeEmail().isEmail(),
  check('password', 'Minimum length is 3').exists().isLength({ min: 3 }),
];
