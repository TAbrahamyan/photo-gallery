import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import './server/config/db';
import user from './server/routes/user';
import config from './server/config/config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', user);

app.listen(config.port, () => {
  console.log(`Server = http://localhost:${config.port}`);
});
