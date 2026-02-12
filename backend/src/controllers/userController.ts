import { Request, Response } from 'express';
import prisma from '../config/db';

export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        // Top users by XP
        // For 'This Week', we would need to filter XP_Logs by date, but for now let's just do all-time or a static field on User.
        // We have `xp_points` on User which is total.
        // Ideally XP should be calculated from XP_Logs for time ranges. 
        // For MVP, we use total XP.

        const users = await prisma.user.findMany({
            orderBy: { xp_points: 'desc' },
            take: 10,
            select: {
                id: true,
                name: true,
                avatar_url: true,
                xp_points: true,
            },
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard', error });
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if "me"
        // If we want /users/me, we need to handle it or use a separate endpoint.
        // For simplicity, frontend can pass ID or use /auth/me for self.

        const user = await prisma.user.findUnique({
            where: { id: id as string },
            select: {
                id: true,
                name: true,
                email: true, // Maybe hide email if not self?
                avatar_url: true,
                xp_points: true,
                role: true,
                created_at: true,
                _count: {
                    select: { posts: true, comments: true },
                },
            },
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};
