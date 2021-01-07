import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token: string = req.headers.token;

    if (!token) {
      return res.status(401).json({ message: 'Auth error' });
    }

    const decoded: any = jwt.verify(token, 'secret');
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(500).send({ message: 'Invalid token' });
  }
}
