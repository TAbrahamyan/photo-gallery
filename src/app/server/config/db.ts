import mongoose from 'mongoose';
import config from './config';

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
})
  .then(_ => console.log('Database is connected'))
  .catch(e => console.log('e:', e));
