import { Router } from 'express';
import { LogicDefenseController } from '../controllers/LogicDefenseController';

/**
 * Logic Defense AI 라우트 생성
 */
export function createLogicDefenseRouter(): Router {
  const router = Router();
  const controller = new LogicDefenseController();

  /**
   * POST /api/logic-defense/simulate
   * 새로운 시뮬레이션 실행
   */
  router.post('/simulate', (req, res) => controller.runSimulation(req, res));

  /**
   * POST /api/logic-defense/quick-test
   * 빠른 테스트 (간소화된 입력)
   */
  router.post('/quick-test', (req, res) => controller.quickTest(req, res));

  /**
   * GET /api/logic-defense/simulations
   * 모든 시뮬레이션 조회
   */
  router.get('/simulations', (req, res) => controller.getAllSimulations(req, res));

  /**
   * GET /api/logic-defense/simulations/:id
   * 특정 시뮬레이션 조회
   */
  router.get('/simulations/:id', (req, res) => controller.getSimulationById(req, res));

  /**
   * GET /api/logic-defense/simulations/:id/markdown
   * 시뮬레이션 마크다운 형식 조회
   */
  router.get('/simulations/:id/markdown', (req, res) =>
    controller.getSimulationMarkdown(req, res)
  );

  /**
   * GET /api/logic-defense/health
   * 헬스 체크
   */
  router.get('/health', (req, res) => controller.healthCheck(req, res));

  return router;
}
