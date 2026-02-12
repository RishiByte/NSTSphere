import { Request, Response } from 'express';
import prisma from '../config/db';

export const getSubjects = async (req: Request, res: Response) => {
    try {
        const subjects = await prisma.subject.findMany({
            orderBy: { name: 'asc' },
        });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subjects', error });
    }
};
