/**
 * Logic Defense AI Engine - Type Definitions
 * 뚝딱인턴(Ddukddak Intern) 플랫폼의 핵심 타입 정의
 */

/**
 * 역량 레벨
 */
export type SkillLevel = 'High' | 'Mid' | 'Low';

/**
 * 방어 결과
 */
export type DefenseResult = '방어 성공' | '방어 실패' | '부분 성공';

/**
 * 시뮬레이션 입력 데이터
 */
export interface SimulationInput {
  jobRole: string;              // 직무 (예: "마케팅", "개발자", "기획자")
  situationKeywords: string[];  // 상황 키워드 (예: ["위기상황", "고객불만"])
  candidateId?: string;         // 지원자 ID (선택)
  difficulty?: 'easy' | 'medium' | 'hard'; // 난이도
}

/**
 * 딜레마 상황
 */
export interface DilemmaContext {
  situation: string;            // 상황 설명
  conflictingValues: {          // 충돌하는 가치
    value1: string;
    value2: string;
  };
  constraints: string[];        // 제약 조건
  stakeholders: string[];       // 이해관계자
  timeLimit?: string;           // 시간 제약
}

/**
 * 의사결정 액션
 */
export interface DecisionAction {
  choice: string;               // 선택한 행동
  reasoning: string;            // 선택 이유
  expectedOutcome: string;      // 예상 결과
  consideredAlternatives?: string[]; // 고려한 대안들
}

/**
 * 트레이드오프 결과
 */
export interface TradeOffResult {
  gains: {
    description: string;        // 얻은 것
    metrics?: string[];         // 정량적 지표
  };
  pains: {
    description: string;        // 잃은 것 / 리스크
    severity: 'critical' | 'high' | 'medium' | 'low';
    affectedStakeholders: string[];
  };
}

/**
 * AI 압박 질문
 */
export interface HavrutaQuestion {
  question: string;             // 압박 질문
  targetWeakness: string;       // 공략 포인트 (논리적 허점)
  expectedDefensePoints: string[]; // 예상되는 방어 논리
}

/**
 * 지원자의 방어 답변
 */
export interface DefenseResponse {
  response: string;             // 방어 답변
  usedEvidence: {               // 사용한 증거
    dataPoints?: string[];      // 데이터 포인트
    longTermPerspective?: string; // 장기적 관점
    contingencyPlan?: string;   // 차선책/대비책
  };
  logicalConsistency: number;   // 논리적 일관성 (0-100)
  emotionalControl: number;     // 감정 조절 (0-100)
}

/**
 * 정량화된 역량 메트릭
 */
export interface QuantifiedMetrics {
  dataBasedThinking: {
    level: SkillLevel;
    evidence: string;
    score: number; // 0-100
  };
  crisisManagement: {
    result: DefenseResult;
    evidence: string;
    score: number;
  };
  businessInsight: {
    tags: string[];             // 예: ["#High_Risk_High_Return", "#Customer_Centric"]
    evidence: string;
    score: number;
  };
  communicationSkill: {
    level: SkillLevel;
    evidence: string;
    persuasionAttempts: number; // 설득 시도 횟수
    score: number;
  };
  logicalDefense: {
    consistency: number;        // 논리적 일관성
    counterArgumentQuality: number; // 반박 논리 품질
    score: number;
  };
}

/**
 * AI 총평
 */
export interface AIEvaluation {
  overallScore: number;         // 종합 점수 (0-100)
  strengths: string[];          // 강점
  weaknesses: string[];         // 약점
  recommendationReason: string; // 추천 사유
  developmentAreas: string[];   // 개발 필요 영역
  standoutMoments: string[];    // 두드러진 순간들
}

/**
 * 완전한 시뮬레이션 리포트
 */
export interface LogicDefenseReport {
  id: string;
  timestamp: Date;

  // 1. 시뮬레이션 개요
  overview: {
    jobRole: string;
    dilemmaContext: DilemmaContext;
    difficulty: string;
  };

  // 2. 의사결정 로그
  processLog: {
    action: DecisionAction;
    tradeOff: TradeOffResult;
  };

  // 3. 하브루타 방어 과정
  havrutaPhase: {
    questions: HavrutaQuestion[];
    defenses: DefenseResponse[];
    defenseQuality: DefenseResult;
  };

  // 4. 핵심 방어 논리 하이라이트
  logicHighlights: string[];

  // 5. 정량화된 역량
  quantifiedMetrics: QuantifiedMetrics;

  // 6. AI 총평
  aiEvaluation: AIEvaluation;

  // 메타데이터
  metadata: {
    candidateId?: string;
    sessionDuration: number;    // 시뮬레이션 소요 시간 (초)
    version: string;            // 엔진 버전
  };
}

/**
 * 시뮬레이션 생성 옵션
 */
export interface SimulationOptions {
  includeMultipleQuestions?: boolean; // 여러 압박 질문 포함 여부
  generateAlternatives?: boolean;     // 대안 시나리오 생성 여부
  detailLevel?: 'concise' | 'detailed'; // 상세 수준
}
