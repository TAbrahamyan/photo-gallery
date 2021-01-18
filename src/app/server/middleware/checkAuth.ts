import { Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

export default (req: any, res: Response, next: () => void) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token: string = req.headers.token;

    if (!token) {
      return res.status(401).json({ message: 'Auth error' });
    }

    const decoded: any = jwt.verify(token, config.secretJWT);
    req.userId = decoded.userId;

    next();
  } catch {
    res.status(500).json({ message: 'Invalid token' });
  }
}
