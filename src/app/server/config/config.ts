export default {
  isProduction: (process.env.NODE_ENV === 'production'),
  port: (process.env.PORT || 8000),
  db: process.env.MONGODB_URL,
  secretJWT: process.env.JWT_SECRET,
} as IConfig;

interface IConfig {
  isProduction: boolean;
  port: string | number;
  db: string;
  secretJWT: string;
}
