import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import './server/config/db';
import { config, createRoutes } from './server/config';

const app = express();
createRoutes(app);
app.listen(config.port, () => console.log(`Server = http://localhost:${config.port}`));
