import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import user from './server/routes/user';
import { initMongoServer } from './server/config/db';

initMongoServer();
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/user', user);

const PORT: string | number = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server = http://localhost:${PORT}`));
