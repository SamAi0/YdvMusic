import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { uploadFile, getPublicUrl } from '../utils/s3.js';

dotenv.config();

// Use memory storage and upload to S3 via AWS SDK v3
const memoryStorage = multer.memoryStorage();

export const uploadAudio = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

export const uploadImage = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export const persistToS3 = async (file, prefix) => {
  const ext = (file.originalname.split('.').pop() || 'bin').toLowerCase();
  const key = `${prefix}/${uuidv4()}-${Date.now()}.${ext}`;
  await uploadFile(file.buffer, key, file.mimetype);
  return getPublicUrl(key);
};

export default { uploadAudio, uploadImage, persistToS3 };