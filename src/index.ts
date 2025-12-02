import express, { Application } from 'express';
import { createAssignmentRouter } from './routes/assignment.routes';
import { createLogicDefenseRouter } from './routes/logicDefense.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/assignments', createAssignmentRouter());
app.use('/api/logic-defense', createLogicDefenseRouter());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`뚝딱인턴 Logic Defense AI Engine is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoints:`);
  console.log(`  - Assignments: http://localhost:${PORT}/api/assignments`);
  console.log(`  - Logic Defense: http://localhost:${PORT}/api/logic-defense`);
  console.log(`\nQuick start:`);
  console.log(`  POST http://localhost:${PORT}/api/logic-defense/quick-test`);
  console.log(`  Body: { "jobRole": "마케팅" }`);
});

export default app;
