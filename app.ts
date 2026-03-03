import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { authenticateToken } from './api/middlewares/auth';
import { getDashboardData } from './api/controllers/dashboardController';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Global
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'VaultSync API is running smooth', timestamp: new Date() });
});

app.get('/api/v1/dashboard', authenticateToken, getDashboardData);

// Error Handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`VaultSync Server running on http://localhost:${PORT}`);
});

export default app;