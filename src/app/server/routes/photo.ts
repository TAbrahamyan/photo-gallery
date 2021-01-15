import { Router } from 'express';
import checkAuth from '../middleware/checkAuth';
import Photo from '../models/Photo';

const router = Router();

router.post('/upload', checkAuth, async (req: any, res) => {
  try {
    const newPhoto = new Photo({ owner: req.userId, src: req.body.photo });
    await newPhoto.save();
    res.status(201).json(newPhoto);
  } catch {
    res.status(500).json({ message: 'Error in upload photo' });
  }
});

router.get('/get-photos', checkAuth, async (req: any, res) => {
  try {
    const photos = await Photo.find({ owner: req.userId });
    res.status(200).json(photos);
  } catch {
    res.status(500).json({ message: 'Error on getting photos' });
  }
});

router.delete('/delete-photo/:id', async (req, res) => {
  try {
    const deletedPhoto = await Photo.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json(deletedPhoto);
  } catch {
    res.status(500).json({ message: 'Error while deleting' });
  }
});

router.patch('/delete-selected', async (req, res) => {
  try {
    await Photo.deleteMany({ _id: req.body.selectedPhotos.map(({ photoId }) => photoId) });
    res.status(200).json({ message: 'Successful deleting' });
  } catch {
    res.status(500).json({ message: 'Error while deleting' });
  }
});

export default router;
