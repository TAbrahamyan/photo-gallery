import express from 'express';
import dotenv from 'dotenv';
import { Express } from 'express-serve-static-core';

dotenv.config();

import './server/config/db';
import { config, createRoutes } from './server/config';

const app: Express = express();
createRoutes(app);
app.listen(config.port, () => console.log(`Server = http://localhost:${config.port}`));
