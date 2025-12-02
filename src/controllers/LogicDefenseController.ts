import { Request, Response } from 'express';
import { LogicDefenseAIService } from '../services/LogicDefenseAIService';
import { SimulationInput, SimulationOptions } from '../types/LogicDefense.types';

/**
 * Logic Defense Controller
 * REST API 엔드포인트를 처리하는 컨트롤러
 */
export class LogicDefenseController {
  private aiService: LogicDefenseAIService;

  constructor() {
    this.aiService = new LogicDefenseAIService();
  }

  /**
   * POST /api/logic-defense/simulate
   * 새로운 시뮬레이션 실행
   *
   * Body:
   * {
   *   "jobRole": "마케팅",
   *   "situationKeywords": ["위기상황", "고객불만"],
   *   "candidateId": "user123",
   *   "difficulty": "medium",
   *   "options": {
   *     "includeMultipleQuestions": true,
   *     "detailLevel": "detailed"
   *   }
   * }
   */
  async runSimulation(req: Request, res: Response): Promise<void> {
    try {
      const input: SimulationInput = {
        jobRole: req.body.jobRole,
        situationKeywords: req.body.situationKeywords || [],
        candidateId: req.body.candidateId,
        difficulty: req.body.difficulty || 'medium'
      };

      // 입력 유효성 검증
      if (!input.jobRole) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'jobRole is required'
        });
        return;
      }

      if (!Array.isArray(input.situationKeywords)) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'situationKeywords must be an array'
        });
        return;
      }

      const options: SimulationOptions = req.body.options || {};

      // 시뮬레이션 실행
      const report = await this.aiService.runFullSimulation(input, options);

      res.status(201).json({
        success: true,
        data: report,
        message: 'Simulation completed successfully'
      });
    } catch (error) {
      console.error('Error running simulation:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * GET /api/logic-defense/simulations/:id
   * 특정 시뮬레이션 조회
   */
  async getSimulationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const report = this.aiService.getSimulationById(id);

      if (!report) {
        res.status(404).json({
          error: 'Not Found',
          message: `Simulation with id ${id} not found`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Error fetching simulation:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * GET /api/logic-defense/simulations
   * 모든 시뮬레이션 조회
   */
  async getAllSimulations(req: Request, res: Response): Promise<void> {
    try {
      const reports = this.aiService.getAllSimulations();

      res.status(200).json({
        success: true,
        count: reports.length,
        data: reports
      });
    } catch (error) {
      console.error('Error fetching simulations:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * GET /api/logic-defense/simulations/:id/markdown
   * 시뮬레이션 결과를 마크다운 형식으로 조회
   */
  async getSimulationMarkdown(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const markdown = this.aiService.generateMarkdownReport(id);

      if (!markdown) {
        res.status(404).json({
          error: 'Not Found',
          message: `Simulation with id ${id} not found`
        });
        return;
      }

      // 마크다운을 텍스트로 반환
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.status(200).send(markdown);
    } catch (error) {
      console.error('Error generating markdown:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * POST /api/logic-defense/quick-test
   * 빠른 테스트를 위한 간소화된 엔드포인트
   *
   * Body:
   * {
   *   "jobRole": "개발자"
   * }
   */
  async quickTest(req: Request, res: Response): Promise<void> {
    try {
      const jobRole = req.body.jobRole || '마케팅';

      const input: SimulationInput = {
        jobRole,
        situationKeywords: [],
        difficulty: 'medium'
      };

      const options: SimulationOptions = {
        includeMultipleQuestions: false,
        detailLevel: 'concise'
      };

      const report = await this.aiService.runFullSimulation(input, options);

      res.status(201).json({
        success: true,
        data: {
          id: report.id,
          jobRole: report.overview.jobRole,
          overallScore: report.aiEvaluation.overallScore,
          defenseQuality: report.havrutaPhase.defenseQuality,
          situation: report.overview.dilemmaContext.situation,
          decision: report.processLog.action.choice,
          recommendation: report.aiEvaluation.recommendationReason
        },
        fullReport: report
      });
    } catch (error) {
      console.error('Error in quick test:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * GET /api/logic-defense/health
   * 헬스 체크
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'ok',
      service: 'Logic Defense AI Engine',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  }
}
