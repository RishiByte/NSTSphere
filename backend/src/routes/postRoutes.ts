import { Router } from 'express';
import { getPosts, getPostById, createPost } from '../controllers/postController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', authenticate, createPost);

export default router;
