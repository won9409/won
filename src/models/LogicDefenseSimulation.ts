import { v4 as uuidv4 } from 'uuid';
import {
  LogicDefenseReport,
  DilemmaContext,
  DecisionAction,
  TradeOffResult,
  HavrutaQuestion,
  DefenseResponse,
  QuantifiedMetrics,
  AIEvaluation,
  DefenseResult,
  SkillLevel
} from '../types/LogicDefense.types';

/**
 * Logic Defense Simulation 데이터 모델
 * 시뮬레이션 리포트의 생성과 관리를 담당
 */
export class LogicDefenseSimulation {
  private report: LogicDefenseReport;

  constructor(
    jobRole: string,
    dilemmaContext: DilemmaContext,
    difficulty: string = 'medium'
  ) {
    this.report = {
      id: uuidv4(),
      timestamp: new Date(),
      overview: {
        jobRole,
        dilemmaContext,
        difficulty
      },
      processLog: {
        action: {
          choice: '',
          reasoning: '',
          expectedOutcome: ''
        },
        tradeOff: {
          gains: { description: '' },
          pains: { description: '', severity: 'medium', affectedStakeholders: [] }
        }
      },
      havrutaPhase: {
        questions: [],
        defenses: [],
        defenseQuality: '방어 실패'
      },
      logicHighlights: [],
      quantifiedMetrics: this.initializeMetrics(),
      aiEvaluation: {
        overallScore: 0,
        strengths: [],
        weaknesses: [],
        recommendationReason: '',
        developmentAreas: [],
        standoutMoments: []
      },
      metadata: {
        sessionDuration: 0,
        version: '1.0.0'
      }
    };
  }

  /**
   * 메트릭 초기화
   */
  private initializeMetrics(): QuantifiedMetrics {
    return {
      dataBasedThinking: {
        level: 'Low',
        evidence: '',
        score: 0
      },
      crisisManagement: {
        result: '방어 실패',
        evidence: '',
        score: 0
      },
      businessInsight: {
        tags: [],
        evidence: '',
        score: 0
      },
      communicationSkill: {
        level: 'Low',
        evidence: '',
        persuasionAttempts: 0,
        score: 0
      },
      logicalDefense: {
        consistency: 0,
        counterArgumentQuality: 0,
        score: 0
      }
    };
  }

  /**
   * 의사결정 액션 설정
   */
  setDecisionAction(action: DecisionAction): void {
    this.report.processLog.action = action;
  }

  /**
   * 트레이드오프 결과 설정
   */
  setTradeOffResult(tradeOff: TradeOffResult): void {
    this.report.processLog.tradeOff = tradeOff;
  }

  /**
   * 하브루타 질문 추가
   */
  addHavrutaQuestion(question: HavrutaQuestion): void {
    this.report.havrutaPhase.questions.push(question);
  }

  /**
   * 방어 답변 추가
   */
  addDefenseResponse(defense: DefenseResponse): void {
    this.report.havrutaPhase.defenses.push(defense);
  }

  /**
   * 방어 품질 설정
   */
  setDefenseQuality(quality: DefenseResult): void {
    this.report.havrutaPhase.defenseQuality = quality;
  }

  /**
   * 핵심 방어 논리 추가
   */
  addLogicHighlight(highlight: string): void {
    this.report.logicHighlights.push(highlight);
  }

  /**
   * 정량화된 메트릭 업데이트
   */
  updateMetrics(metrics: Partial<QuantifiedMetrics>): void {
    this.report.quantifiedMetrics = {
      ...this.report.quantifiedMetrics,
      ...metrics
    };
  }

  /**
   * AI 평가 설정
   */
  setAIEvaluation(evaluation: AIEvaluation): void {
    this.report.aiEvaluation = evaluation;
  }

  /**
   * 세션 메타데이터 업데이트
   */
  updateMetadata(candidateId: string, sessionDuration: number): void {
    this.report.metadata.candidateId = candidateId;
    this.report.metadata.sessionDuration = sessionDuration;
  }

  /**
   * 전체 리포트 반환
   */
  getReport(): LogicDefenseReport {
    return { ...this.report };
  }

  /**
   * 리포트 ID 반환
   */
  getId(): string {
    return this.report.id;
  }

  /**
   * 마크다운 형식으로 리포트 생성
   */
  generateMarkdownReport(): string {
    const r = this.report;

    return `# 뚝딱인턴: 로직 디펜스 리포트

## 1. 시뮬레이션 개요
* **직무:** ${r.overview.jobRole}
* **난이도:** ${r.overview.difficulty}
* **딜레마 상황:** ${r.overview.dilemmaContext.situation}
* **충돌하는 가치:** ${r.overview.dilemmaContext.conflictingValues.value1} vs ${r.overview.dilemmaContext.conflictingValues.value2}

## 2. 의사결정 로그 (Process Log)
### Action
* **선택:** ${r.processLog.action.choice}
* **이유:** ${r.processLog.action.reasoning}
* **예상 결과:** ${r.processLog.action.expectedOutcome}

### Trade-off
* **얻은 것 (Gain):** ${r.processLog.tradeOff.gains.description}
${r.processLog.tradeOff.gains.metrics ? `  - 지표: ${r.processLog.tradeOff.gains.metrics.join(', ')}` : ''}
* **잃은 것 (Pain):** ${r.processLog.tradeOff.pains.description}
  - 심각도: ${r.processLog.tradeOff.pains.severity}
  - 영향받는 이해관계자: ${r.processLog.tradeOff.pains.affectedStakeholders.join(', ')}

## 3. 하브루타 방어 과정
### AI 압박 질문
${r.havrutaPhase.questions.map((q, i) => `
**질문 ${i + 1}:** ${q.question}
- 공략 포인트: ${q.targetWeakness}
`).join('\n')}

### 지원자 방어 답변
${r.havrutaPhase.defenses.map((d, i) => `
**방어 ${i + 1}:** ${d.response}
- 논리적 일관성: ${d.logicalConsistency}/100
- 감정 조절: ${d.emotionalControl}/100
${d.usedEvidence.dataPoints ? `- 사용 데이터: ${d.usedEvidence.dataPoints.join(', ')}` : ''}
`).join('\n')}

**방어 품질:** ${r.havrutaPhase.defenseQuality}

## 4. 핵심 방어 논리 (Logic Highlights)
${r.logicHighlights.map(h => `* ${h}`).join('\n')}

## 5. 정성적 역량의 정량화 (Quantified Metrics)

### 데이터 기반 사고
* **레벨:** ${r.quantifiedMetrics.dataBasedThinking.level}
* **점수:** ${r.quantifiedMetrics.dataBasedThinking.score}/100
* **근거:** ${r.quantifiedMetrics.dataBasedThinking.evidence}

### 위기 대처 능력
* **결과:** ${r.quantifiedMetrics.crisisManagement.result}
* **점수:** ${r.quantifiedMetrics.crisisManagement.score}/100
* **근거:** ${r.quantifiedMetrics.crisisManagement.evidence}

### 비즈니스 인사이트
* **태그:** ${r.quantifiedMetrics.businessInsight.tags.join(', ')}
* **점수:** ${r.quantifiedMetrics.businessInsight.score}/100
* **근거:** ${r.quantifiedMetrics.businessInsight.evidence}

### 소통 능력
* **레벨:** ${r.quantifiedMetrics.communicationSkill.level}
* **설득 시도:** ${r.quantifiedMetrics.communicationSkill.persuasionAttempts}회
* **점수:** ${r.quantifiedMetrics.communicationSkill.score}/100
* **근거:** ${r.quantifiedMetrics.communicationSkill.evidence}

### 논리적 방어력
* **논리 일관성:** ${r.quantifiedMetrics.logicalDefense.consistency}/100
* **반박 품질:** ${r.quantifiedMetrics.logicalDefense.counterArgumentQuality}/100
* **종합 점수:** ${r.quantifiedMetrics.logicalDefense.score}/100

## 6. AI 총평
**종합 점수:** ${r.aiEvaluation.overallScore}/100

### 강점
${r.aiEvaluation.strengths.map(s => `* ${s}`).join('\n')}

### 약점
${r.aiEvaluation.weaknesses.map(w => `* ${w}`).join('\n')}

### 두드러진 순간
${r.aiEvaluation.standoutMoments.map(m => `* ${m}`).join('\n')}

### 추천 사유
${r.aiEvaluation.recommendationReason}

### 개발 필요 영역
${r.aiEvaluation.developmentAreas.map(a => `* ${a}`).join('\n')}

---
**리포트 ID:** ${r.id}
**생성 시간:** ${r.timestamp.toISOString()}
**세션 소요 시간:** ${r.metadata.sessionDuration}초
**엔진 버전:** ${r.metadata.version}
`;
  }
}
