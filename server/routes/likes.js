import express from 'express';
import { getLikedSongs, likeSong, unlikeSong, checkLikeStatus } from '../controllers/likesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getLikedSongs);
router.post('/', authenticateToken, likeSong);
router.delete('/:songId', authenticateToken, unlikeSong);
router.get('/:songId/status', authenticateToken, checkLikeStatus);

export default router;