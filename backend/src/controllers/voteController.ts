import { Request, Response } from 'express';
import prisma from '../config/db';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const votePost = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string; // Post ID
        const { type } = req.body; // 1 (up) or -1 (down)
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        // Check if post exists
        const post = await prisma.post.findUnique({ where: { id: id as string } });
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Check existing vote
        const existingVote = await prisma.vote.findFirst({
            where: {
                user_id: userId,
                post_id: id as string,
            },
        });

        let scoreChange = 0;
        let xpChange = 0;

        if (existingVote) {
            if (existingVote.vote_type === type) {
                // Toggle off (remove vote)
                await prisma.vote.delete({ where: { id: existingVote.id } });
                scoreChange = -type;
                // Revert XP if it was an upvote
                if (type === 1) xpChange = -5;
            } else {
                // Change vote (swap)
                await prisma.vote.update({
                    where: { id: existingVote.id },
                    data: { vote_type: type },
                });
                scoreChange = type * 2;
                // Adjust XP
                if (type === 1) xpChange = 5; // Down to Up
                else xpChange = -5; // Up to Down
            }
        } else {
            // New Vote
            await prisma.vote.create({
                data: {
                    user_id: userId,
                    post_id: id as string,
                    vote_type: type,
                }
            });
            scoreChange = type;
            if (type === 1) xpChange = 5;
        }

        // Update Post Score
        const updatedPost = await prisma.post.update({
            where: { id: id as string },
            data: { vote_score: { increment: scoreChange } }
        });

        // Update Author XP (Loophole: don't give XP if author votes on own post usually, but let's keep it simple)
        if (xpChange !== 0 && post.author_id !== userId) {
            await prisma.user.update({
                where: { id: post.author_id },
                data: { xp_points: { increment: xpChange } }
            });

            // Log XP?
        }

        res.json({ success: true, newScore: updatedPost.vote_score });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error voting', error });
    }
};

export const voteComment = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string; // Comment ID
        const { type } = req.body; // 1 (up) or -1 (down)
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const comment = await prisma.comment.findUnique({ where: { id: id as string } });
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        const existingVote = await prisma.vote.findFirst({
            where: {
                user_id: userId,
                comment_id: id as string,
            },
        });

        let scoreChange = 0;
        let xpChange = 0;

        if (existingVote) {
            if (existingVote.vote_type === type) {
                // Toggle off
                await prisma.vote.delete({ where: { id: existingVote.id } });
                scoreChange = -type;
                if (type === 1) xpChange = -2;
            } else {
                // Swap
                await prisma.vote.update({
                    where: { id: existingVote.id },
                    data: { vote_type: type },
                });
                scoreChange = type * 2;
                if (type === 1) xpChange = 2;
                else xpChange = -2;
            }
        } else {
            // New Vote
            await prisma.vote.create({
                data: {
                    user_id: userId,
                    comment_id: id as string,
                    vote_type: type,
                }
            });
            scoreChange = type;
            if (type === 1) xpChange = 2;
        }

        const updatedComment = await prisma.comment.update({
            where: { id: id as string },
            data: { vote_score: { increment: scoreChange } }
        });

        if (xpChange !== 0 && comment.author_id !== userId) {
            await prisma.user.update({
                where: { id: comment.author_id },
                data: { xp_points: { increment: xpChange } }
            });
        }

        res.json({ success: true, newScore: updatedComment.vote_score });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error voting', error: (error as Error).message });
    }
};
