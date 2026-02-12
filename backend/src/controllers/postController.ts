import { Request, Response } from 'express';
import prisma from '../config/db';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const getPosts = async (req: Request, res: Response) => {
    try {
        const { subject, sort, search, author } = req.query;

        const where: any = { is_deleted: false };
        if (subject) {
            where.subject = { slug: subject as string };
        }
        if (author) {
            where.author_id = author as string;
        }
        if (search) {
            where.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { content: { contains: search as string, mode: 'insensitive' } },
            ];
        }

        let orderBy: any = { created_at: 'desc' };
        if (sort === 'hot') {
            // Complex sorting logic isn't directly supported in basic Prisma 'orderBy', 
            // usually requires raw SQL or application-level sorting.
            // For 'hot', we'll approximate with vote_score for now.
            orderBy = { vote_score: 'desc' };
        } else if (sort === 'top') {
            orderBy = { vote_score: 'desc' };
        }

        const posts = await prisma.post.findMany({
            where,
            orderBy,
            include: {
                author: {
                    select: { id: true, name: true, avatar_url: true, xp_points: true },
                },
                subject: true,
                _count: {
                    select: { comments: true },
                },
            },
            take: 20, // Pagination limit placeholder
        });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({
            where: { id: id as string },
            include: {
                author: {
                    select: { id: true, name: true, avatar_url: true, xp_points: true },
                },
                subject: true,
                _count: {
                    select: { comments: true },
                },
            },
        });

        if (!post || post.is_deleted) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error });
    }
};

export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, subject_id } = req.body;

        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const post = await prisma.post.create({
            data: {
                title,
                content,
                subject_id,
                author_id: req.user.id,
            },
        });

        // Add XP to user (Placeholder logic)
        await prisma.user.update({
            where: { id: req.user.id },
            data: { xp_points: { increment: 10 } } // +10 XP for posting
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
};
