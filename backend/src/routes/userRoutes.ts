import { Router } from 'express';
import { getLeaderboard, getUserProfile } from '../controllers/userController';

const router = Router();

router.get('/leaderboard', getLeaderboard);
router.get('/:id', getUserProfile);

export default router;
