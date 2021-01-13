import { Router } from 'express';
import checkAuth from '../middleware/checkAuth';
import User from '../models/User';

const router = Router();

router.post('/upload-photo', checkAuth, async (req: any, res: any) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.userId },
      { $push: { photos: req.body.photo } },
      { new: true },
    );

    res.status(200).json(user.photos);
  } catch {
    res.status(500).json({ message: 'Error in upload photo' });
  }
});

router.get('/get-photos', checkAuth, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json(user.photos);
  } catch {
    res.status(400).json({ message: 'Error on getting photos' });
  }
});

router.delete('/delete-photo/:photoIndex', checkAuth, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.userId);
    const updatedPhotos = user.photos.filter((_, i) => i !== +req.params.photoIndex);
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.userId },
      { $set: { photos: updatedPhotos } },
      { new: true },
    );

    res.status(200).json(updatedUser.photos);
  } catch {
    res.status(405).json({ message: 'Error while deleting' });
  }
});

export default router;
