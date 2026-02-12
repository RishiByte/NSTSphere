import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Subjects
    const subjects = [
        { name: 'Computer Science', slug: 'cs' },
        { name: 'Mathematics', slug: 'math' },
        { name: 'Physics', slug: 'physics' },
        { name: 'Chemistry', slug: 'chemistry' },
        { name: 'Literature', slug: 'literature' },
        { name: 'History', slug: 'history' },
        { name: 'Economics', slug: 'economics' },
    ];

    for (const s of subjects) {
        await prisma.subject.upsert({
            where: { slug: s.slug },
            update: {},
            create: s,
        });
    }

    // Users
    const password = await bcrypt.hash('password123', 10);

    const alice = await prisma.user.upsert({
        where: { email: 'alice@example.com' },
        update: {},
        create: {
            email: 'alice@example.com',
            name: 'Alice Johnson',
            password_hash: password,
            role: 'STUDENT',
            xp_points: 150,
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
        },
    });

    const bob = await prisma.user.upsert({
        where: { email: 'bob@example.com' },
        update: {},
        create: {
            email: 'bob@example.com',
            name: 'Bob Smith',
            password_hash: password,
            role: 'STUDENT',
            xp_points: 80,
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
        },
    });

    // Posts
    const csSubject = await prisma.subject.findUnique({ where: { slug: 'cs' } });

    if (csSubject) {
        await prisma.post.create({
            data: {
                title: 'How to implement QuickSort in Python?',
                content: 'I am struggling with the recursion part of QuickSort. Can anyone explain?',
                author_id: alice.id,
                subject_id: csSubject.id,
                vote_score: 5,
            },
        });

        await prisma.post.create({
            data: {
                title: 'Difference between TCP and UDP',
                content: 'Here is a detailed comparison for the upcoming exam...',
                author_id: bob.id,
                subject_id: csSubject.id,
                vote_score: 12,
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
