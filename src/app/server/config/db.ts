import mongoose from 'mongoose';

const url: string = 'mongodb+srv://photoGallery:photoGallery@cluster0.cicn5.mongodb.net/photo-gallery?retryWrites=true&w=majority';

export const initMongoServer = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });

    console.log('Database is connected!');
  } catch (e) {
    console.error('Error: ', e);
    throw e;
  }
}
