import express from 'express';
import { 
  getUserPlaylists, 
  getPlaylist, 
  createPlaylist, 
  updatePlaylist, 
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} from '../controllers/playlistController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getUserPlaylists);
router.get('/:id', optionalAuth, getPlaylist);
router.post('/', authenticateToken, createPlaylist);
router.put('/:id', authenticateToken, updatePlaylist);
router.delete('/:id', authenticateToken, deletePlaylist);
router.post('/:id/songs', authenticateToken, addSongToPlaylist);
router.delete('/:id/songs/:songId', authenticateToken, removeSongFromPlaylist);

export default router;