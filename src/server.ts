import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import memberRoutes from './routes/members';
import pastorRoutes from './routes/pastors';
import titheRoutes from './routes/tithes';
import contributionRoutes from './routes/contributions';
import branchRoutes from './routes/branches';
import { errorMiddleware } from './middlewares/errorMiddleware';
import prisma from './db';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ success: true, message: 'Church API' }));

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/pastors', pastorRoutes);
app.use('/api/tithes', titheRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/branches', branchRoutes);

// error handler
app.use(errorMiddleware);

const PORT = Number(process.env.PORT || 4000);

async function main() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// ensure prisma connection is established
prisma.$connect().then(main).catch((err: Error) => {
  console.error('Failed to connect to DB', err);
  process.exit(1);
});