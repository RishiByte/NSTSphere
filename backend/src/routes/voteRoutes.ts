import { Router } from 'express';
import { votePost, voteComment } from '../controllers/voteController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/post/:id', authenticate, votePost);
router.post('/comment/:id', authenticate, voteComment);

export default router;
