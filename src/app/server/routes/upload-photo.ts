import { Router } from 'express';
import checkAuth from '../middleware/checkAuth';
import User from '../models/User';

const router = Router();

router.post('/upload-photo', checkAuth, async (req: any, res: any) => {
  try {
    const userPhotos: any = await User.findByIdAndUpdate(
      { _id: req.userId },
      { $push: { photos: req.body.photo } },
      { new: true },
    );

    res.status(200).json(userPhotos.photos);
  } catch {
    res.status(500).json({ message: 'Error in upload photo' });
  }
});

router.get('/get-photos', checkAuth, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json(user.photos);
  } catch {
    res.status(401).json({ message: 'Error on getting photos' });
  }
});

export default router;
