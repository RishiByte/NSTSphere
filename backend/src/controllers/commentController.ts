import { Request, Response } from 'express';
import prisma from '../config/db';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const getComments = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId as string;

        // Fetch all comments for the post
        const comments = await prisma.comment.findMany({
            where: { post_id: postId as string },
            include: {
                author: {
                    select: { id: true, name: true, avatar_url: true, xp_points: true },
                },
            },
            orderBy: { created_at: 'asc' }, // Oldest first matches typical forums
        });

        // We return flat list. Frontend can reconstruct tree using parent_comment_id
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
};

export const createComment = async (req: AuthRequest, res: Response) => {
    try {
        const postId = req.params.postId as string; // or from body
        const { content, parent_comment_id } = req.body;

        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        // Validate post exists
        const post = await prisma.post.findUnique({ where: { id: postId as string } });
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = await prisma.comment.create({
            data: {
                content,
                post_id: postId as string,
                author_id: req.user.id,
                parent_comment_id: parent_comment_id || null,
            },
            include: {
                author: {
                    select: { id: true, name: true, avatar_url: true },
                },
            },
        });

        // Add XP? Maybe smaller amount
        // await prisma.user.update({ ... })

        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating comment', error });
    }
};
