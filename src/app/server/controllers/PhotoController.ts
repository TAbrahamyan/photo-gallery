import Photo from '../models/Photo';

export class PhotoController {
  static async upload(req, res): Promise<void> {
    try {
      const newPhoto = new Photo({ owner: req.userId, src: req.body.photo, name: req.body.name });
      await newPhoto.save();
      res.status(201).json(newPhoto);
    } catch {
      res.status(500).json({ message: 'Error in upload photo' });
    }
  }

  static async photos(req, res): Promise<void> {
    try {
      const photos = await Photo.find({ owner: req.userId }).sort({ createdAt: 'desc' });
      res.status(200).json(photos);
    } catch {
      res.status(500).json({ message: 'Error on getting photos' });
    }
  }

  static async delete(req, res): Promise<void> {
    try {
      await Photo.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json({ message: 'Photo delete' });
    } catch {
      res.status(500).json({ message: 'Error while deleting' });
    }
  }

  static async bulkDelete(req, res): Promise<void> {
    try {
      await Photo.deleteMany({ _id: req.body.photosId });
      res.status(200).json({ message: 'Bulk delete' });
    } catch {
      res.status(500).json({ message: 'Error while deleting' });
    }
  }
}
