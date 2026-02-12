import { Router } from 'express';
import { getComments, createComment } from '../controllers/commentController';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true }); // Enable access to params from parent router if nested

// Route: /posts/:postId/comments
router.get('/', getComments);
router.post('/', authenticate, createComment);

export default router;
