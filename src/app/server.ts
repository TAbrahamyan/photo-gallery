import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import './server/config/db';
import config from './server/config/config';
import { createRoutes } from './server/config/routes';

const app = express();
createRoutes(app);
app.listen(config.port, () => console.log(`Server = http://localhost:${config.port}`));
