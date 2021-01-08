import { check } from 'express-validator';

export const signupValidation = [
  check('username').notEmpty(),
  check('email', 'Invalid email').isEmail(),
  check('password', 'Password minimum length is 4').isLength({ min: 4 }),
];

export const loginValidation = [
  check('email', 'Invalid email').normalizeEmail().isEmail(),
  check('password', 'Password minimum length is 4').exists().isLength({ min: 4 }),
];
