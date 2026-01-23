import express, { Application } from 'express';
import { createAssignmentRouter } from './routes/assignment.routes';
import { createInternRouter } from './routes/intern.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/assignments', createAssignmentRouter());
app.use('/api/interns', createInternRouter());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Assignment Service is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Assignment API: http://localhost:${PORT}/api/assignments`);
  console.log(`Intern API: http://localhost:${PORT}/api/interns`);
});

export default app;
