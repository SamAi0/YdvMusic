import express from 'express';
import { 
  getSongs, 
  getSong, 
  uploadSong, 
  getArtists, 
  getArtist, 
  getAlbums, 
  getAlbum 
} from '../controllers/musicController.js';
import { authenticateToken, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { uploadAudio } from '../config/storage.js';

const router = express.Router();

// Songs routes
router.get('/songs', optionalAuth, getSongs);
router.get('/songs/:id', optionalAuth, getSong);
router.post('/songs', authenticateToken, requireAdmin, uploadAudio.single('audio'), uploadSong);

// Artists routes
router.get('/artists', getArtists);
router.get('/artists/:id', getArtist);

// Albums routes
router.get('/albums', getAlbums);
router.get('/albums/:id', getAlbum);

export default router;