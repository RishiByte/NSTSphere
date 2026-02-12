import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import voteRoutes from './routes/voteRoutes';
import userRoutes from './routes/userRoutes';
import subjectRoutes from './routes/subjectRoutes';
import authRoutes from './routes/authRoutes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/:postId/comments', commentRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('NSTSphere API is running');
});

export default app;
