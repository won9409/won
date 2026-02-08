import {
  SimulationInput,
  SimulationOptions,
  DilemmaContext,
  DecisionAction,
  TradeOffResult,
  HavrutaQuestion,
  DefenseResponse,
  QuantifiedMetrics,
  AIEvaluation,
  LogicDefenseReport,
  SkillLevel,
  DefenseResult
} from '../types/LogicDefense.types';
import { LogicDefenseSimulation } from '../models/LogicDefenseSimulation';

/**
 * Logic Defense AI Engine Service
 * 뚝딱인턴 플랫폼의 핵심 시뮬레이션 엔진
 *
 * 철학:
 * 1. No Perfect Answer (정답 없음)
 * 2. Havruta & Metacognition (하브루타와 메타인지)
 * 3. Quantification of Qualities (정성의 정량화)
 */
export class LogicDefenseAIService {
  private simulations: Map<string, LogicDefenseSimulation>;

  constructor() {
    this.simulations = new Map();
  }

  /**
   * 완전한 시뮬레이션 실행
   * 4단계 프로세스를 모두 수행
   */
  async runFullSimulation(
    input: SimulationInput,
    options: SimulationOptions = {}
  ): Promise<LogicDefenseReport> {
    const startTime = Date.now();

    // 1단계: 딜레마 상황 생성
    const dilemmaContext = this.generateDilemmaContext(
      input.jobRole,
      input.situationKeywords,
      input.difficulty || 'medium'
    );

    // 시뮬레이션 객체 생성
    const simulation = new LogicDefenseSimulation(
      input.jobRole,
      dilemmaContext,
      input.difficulty || 'medium'
    );

    // 2단계: 의사결정 및 결과 시뮬레이션
    const { action, tradeOff } = this.simulateDecisionAndConsequence(
      dilemmaContext,
      input.jobRole
    );
    simulation.setDecisionAction(action);
    simulation.setTradeOffResult(tradeOff);

    // 3단계: AI 압박 면접 (Havruta Defense Phase)
    const numQuestions = options.includeMultipleQuestions ? 3 : 1;
    for (let i = 0; i < numQuestions; i++) {
      const question = this.generateHavrutaQuestion(tradeOff, action, i);
      simulation.addHavrutaQuestion(question);

      const defense = this.generateDefenseResponse(question, action, tradeOff);
      simulation.addDefenseResponse(defense);
    }

    // 방어 품질 평가
    const defenseQuality = this.evaluateDefenseQuality(simulation.getReport());
    simulation.setDefenseQuality(defenseQuality);

    // 핵심 방어 논리 추출
    const highlights = this.extractLogicHighlights(action, tradeOff);
    highlights.forEach(h => simulation.addLogicHighlight(h));

    // 4단계: 정량화된 메트릭 생성
    const metrics = this.quantifyMetrics(simulation.getReport());
    simulation.updateMetrics(metrics);

    // AI 총평 생성
    const evaluation = this.generateAIEvaluation(simulation.getReport());
    simulation.setAIEvaluation(evaluation);

    // 메타데이터 업데이트
    const sessionDuration = Math.floor((Date.now() - startTime) / 1000);
    simulation.updateMetadata(input.candidateId || 'anonymous', sessionDuration);

    // 시뮬레이션 저장
    this.simulations.set(simulation.getId(), simulation);

    return simulation.getReport();
  }

  /**
   * 1단계: 딜레마 상황 생성
   * 가치관이 충돌하는 현실적인 비즈니스 상황 생성
   */
  private generateDilemmaContext(
    jobRole: string,
    keywords: string[],
    difficulty: string
  ): DilemmaContext {
    // 직무별 딜레마 템플릿
    const dilemmaTemplates = this.getDilemmaTemplatesByRole(jobRole);

    // 키워드를 반영한 상황 생성
    const template = dilemmaTemplates[Math.floor(Math.random() * dilemmaTemplates.length)];
    const situation = this.buildSituationWithKeywords(template, keywords, difficulty);

    return situation;
  }

  /**
   * 직무별 딜레마 템플릿 반환
   */
  private getDilemmaTemplatesByRole(jobRole: string): DilemmaContext[] {
    const templates: Record<string, DilemmaContext[]> = {
      '마케팅': [
        {
          situation: '신제품 출시 3주 전, 경쟁사가 유사 제품을 먼저 출시했습니다. CMO는 예산을 2배로 늘려 공격적 마케팅을 제안하지만, CFO는 ROI 불확실성을 우려합니다. 현재 마케팅 예산은 5천만원이며, 기존 계획대로라면 2개월간 점진적 인지도 확산 전략이었습니다.',
          conflictingValues: {
            value1: '시장 선점 (속도와 공격성)',
            value2: '재무 안정성 (ROI와 리스크 관리)'
          },
          constraints: [
            '출시일 변경 불가 (이미 유통 계약 완료)',
            '추가 예산 승인시 다른 프로젝트 축소 불가피',
            '경쟁사 제품은 이미 긍정적 리뷰 획득'
          ],
          stakeholders: ['CMO', 'CFO', '영업팀', '제품팀', '기존 고객'],
          timeLimit: '48시간 내 결정 필요'
        },
        {
          situation: 'VIP 고객(연 매출 3억)이 특별 할인(30%)을 요구하며, 거절시 경쟁사 이동을 시사했습니다. 그러나 이 조건을 수용하면 동일 등급 다른 VIP 10곳도 같은 요구를 할 가능성이 높습니다.',
          conflictingValues: {
            value1: '단기 매출 유지',
            value2: '브랜드 가격 정책 일관성'
          },
          constraints: [
            '고객 이탈시 분기 목표 미달 확실',
            '할인 선례 시 연간 4억 손실 추정',
            '경쟁사는 실제로 낮은 가격 제시 중'
          ],
          stakeholders: ['VIP 고객', '다른 VIP 고객들', '영업팀', '재무팀'],
          timeLimit: '이번 주 내 답변 필요'
        }
      ],
      '개발자': [
        {
          situation: '출시 2일 전, 보안팀이 중대한 취약점을 발견했습니다. 수정에는 최소 1주일 필요하지만, CEO는 투자자 데모 일정상 예정대로 출시를 강력히 원합니다. 취약점 발생 확률은 5% 미만이지만, 발생시 고객 데이터 유출 가능성이 있습니다.',
          conflictingValues: {
            value1: '비즈니스 일정 준수 (투자 유치)',
            value2: '보안과 품질 (고객 신뢰)'
          },
          constraints: [
            '투자자 데모 일정 변경 불가',
            '취약점 임시 패치 가능하나 근본적 해결 아님',
            '경쟁사가 유사 제품 곧 출시 예정'
          ],
          stakeholders: ['CEO', '보안팀', '고객', '투자자', '개발팀'],
          timeLimit: '24시간 내 최종 결정'
        },
        {
          situation: '레거시 코드 리팩토링을 3개월간 진행하려 하지만, PM은 신규 기능 개발을 우선시합니다. 현재 기술 부채로 인해 버그 발생률이 월 15건이며, 개발 속도가 30% 저하되었습니다.',
          conflictingValues: {
            value1: '기술 부채 해소 (장기적 효율)',
            value2: '신규 기능 출시 (단기적 매출)'
          },
          constraints: [
            '리팩토링 중 신규 기능 개발 불가',
            '경쟁사는 매달 새로운 기능 출시 중',
            '현재 개발팀 이직률 증가 (기술 부채 스트레스)'
          ],
          stakeholders: ['개발팀', 'PM', '고객', '경영진'],
          timeLimit: '분기 계획 수립 전 결정'
        }
      ],
      '기획자': [
        {
          situation: '사용자 테스트 결과, 핵심 기능의 UX가 복잡하다는 피드백이 80%입니다. 단순화하려면 출시 일정이 2개월 지연되며, 그동안 경쟁사가 시장 점유율을 확대할 것입니다.',
          conflictingValues: {
            value1: '사용자 경험 품질 (장기 성공)',
            value2: '시장 타이밍 (선점 효과)'
          },
          constraints: [
            '투자자가 예정된 출시일을 알고 있음',
            'UX 개선 없이 출시시 초기 리뷰 악화 우려',
            '개발 리소스 추가 투입 불가'
          ],
          stakeholders: ['사용자', '개발팀', '투자자', '경영진'],
          timeLimit: '이번 주 내 로드맵 확정'
        }
      ],
      '영업': [
        {
          situation: '대형 클라이언트가 기술적으로 불가능한 커스터마이징을 요구하며, 이것이 계약 조건입니다. 계약 규모는 10억이지만, 개발팀은 해당 기능 구현이 6개월 이상 걸리고 다른 프로젝트에 악영향을 준다고 반대합니다.',
          conflictingValues: {
            value1: '대형 계약 성사 (매출 목표)',
            value2: '기술 팀 역량과 일정 (실현 가능성)'
          },
          constraints: [
            '분기 말까지 목표 달성 필요',
            '개발 리소스는 이미 포화 상태',
            '클라이언트는 타협 의사 없음'
          ],
          stakeholders: ['클라이언트', '개발팀', '영업팀', '경영진'],
          timeLimit: '이번 주 내 계약 체결 또는 포기'
        }
      ],
      'PM': [
        {
          situation: '제품 로드맵 회의에서 두 가지 방향이 충돌합니다. 영업팀은 엔터프라이즈 고객을 위한 B2B 기능을, 마케팅팀은 바이럴 확산을 위한 B2C 기능을 요구합니다. 리소스상 하나만 선택 가능합니다.',
          conflictingValues: {
            value1: '고수익 B2B 전략 (안정적 매출)',
            value2: '고성장 B2C 전략 (사용자 확대)'
          },
          constraints: [
            '개발 리소스는 6개월간 한 방향만 집중 가능',
            'B2B 선택시 초기 성장률 저하',
            'B2C 선택시 단기 매출 감소'
          ],
          stakeholders: ['영업팀', '마케팅팀', '개발팀', '투자자', '경영진'],
          timeLimit: '분기 계획 확정 전 결정'
        }
      ]
    };

    // 기본 템플릿 (매칭되는 직무가 없을 경우)
    const defaultTemplate: DilemmaContext = {
      situation: `${jobRole} 직무에서 중요한 의사결정이 필요한 상황입니다. 단기적 성과와 장기적 가치가 충돌하고 있으며, 이해관계자들의 요구가 상충됩니다.`,
      conflictingValues: {
        value1: '단기 성과',
        value2: '장기 가치'
      },
      constraints: ['제한된 리소스', '시간 압박', '이해관계자 갈등'],
      stakeholders: ['팀원', '경영진', '고객'],
      timeLimit: '빠른 결정 필요'
    };

    return templates[jobRole] || [defaultTemplate];
  }

  /**
   * 키워드를 반영한 상황 구축
   */
  private buildSituationWithKeywords(
    template: DilemmaContext,
    keywords: string[],
    difficulty: string
  ): DilemmaContext {
    let situation = template.situation;

    // 키워드를 상황에 통합
    if (keywords.includes('위기상황') || keywords.includes('긴급')) {
      situation += ' 상황은 더욱 악화되고 있으며, 경쟁사는 이 기회를 활용하려 합니다.';
    }
    if (keywords.includes('고객불만')) {
      situation += ' 동시에 소셜 미디어에서 고객 불만이 확산되고 있습니다.';
    }
    if (keywords.includes('예산부족')) {
      situation += ' 추가 예산 확보는 거의 불가능한 상황입니다.';
    }

    // 난이도에 따른 제약 조건 강화
    const constraints = [...template.constraints];
    if (difficulty === 'hard') {
      constraints.push('언론의 주목을 받고 있어 결정 과정이 공개될 예정');
      constraints.push('내부 정보 유출로 경쟁사가 우리 상황을 알고 있음');
    }

    return {
      ...template,
      situation,
      constraints
    };
  }

  /**
   * 2단계: 의사결정 및 결과 시뮬레이션
   * 실무자가 내릴 법한 결정과 그에 따른 Trade-off 시뮬레이션
   */
  private simulateDecisionAndConsequence(
    dilemma: DilemmaContext,
    jobRole: string
  ): { action: DecisionAction; tradeOff: TradeOffResult } {
    // 실제 비즈니스에서 취할 법한 결정 시뮬레이션
    const action: DecisionAction = {
      choice: this.generateRealisticChoice(dilemma, jobRole),
      reasoning: this.generateReasoning(dilemma),
      expectedOutcome: '단기적 위기는 해소하되, 새로운 리스크가 발생할 수 있음',
      consideredAlternatives: this.generateAlternatives(dilemma)
    };

    // Trade-off 생성 (반드시 Gain과 Pain이 동시에 존재)
    const tradeOff: TradeOffResult = this.generateTradeOff(action, dilemma);

    return { action, tradeOff };
  }

  /**
   * 현실적인 선택 생성
   */
  private generateRealisticChoice(dilemma: DilemmaContext, jobRole: string): string {
    // 직무별 일반적인 의사결정 패턴
    const choicePatterns: Record<string, string[]> = {
      '마케팅': [
        '공격적 마케팅 예산 증액을 승인하되, ROI 트래킹 조건 추가',
        'VIP 고객에게 특별 할인을 제공하되, 재계약시 정상가 복귀 조건 명시',
        '빠른 시장 진입을 위해 기존 계획대로 진행하되, A/B 테스트로 리스크 헷지'
      ],
      '개발자': [
        '임시 보안 패치를 적용하여 예정대로 출시하고, 1주일 내 정식 패치 배포 계획',
        '핵심 기능만 리팩토링하고 신규 기능 개발을 병행하는 하이브리드 접근',
        '출시를 3일 연기하여 치명적 버그만 수정하고, 나머지는 다음 버전에서 개선'
      ],
      '기획자': [
        '핵심 UX만 개선하여 1개월 연기로 타협',
        '단계적 출시 전략: 얼리어답터용 베타 버전 먼저 출시 후 피드백 반영',
        '예정대로 출시하되, UX 개선 로드맵을 명확히 공개하여 기대치 관리'
      ],
      '영업': [
        '계약 규모를 70%로 축소하되, 실현 가능한 범위 내에서 커스터마이징 제공',
        '계약을 수용하되, 개발 일정을 단계별로 나누어 점진적 납품 계약',
        '기술팀과 협의하여 대안 솔루션을 제시하고, 고객 설득 시도'
      ]
    };

    const choices = choicePatterns[jobRole] || [
      `${dilemma.conflictingValues.value1}을 우선하되, ${dilemma.conflictingValues.value2}에 대한 대비책 마련`
    ];

    return choices[Math.floor(Math.random() * choices.length)];
  }

  /**
   * 선택 이유 생성
   */
  private generateReasoning(dilemma: DilemmaContext): string {
    return `${dilemma.timeLimit} 내에서 ${dilemma.stakeholders[0]}의 요구와 ${dilemma.stakeholders[1]}의 우려를 동시에 고려한 결과, 단기적 위기 해소가 우선순위라고 판단했습니다. 다만 ${dilemma.conflictingValues.value2}를 완전히 무시하지 않고 최소한의 안전장치를 마련하여 리스크를 관리하고자 합니다.`;
  }

  /**
   * 대안 생성
   */
  private generateAlternatives(dilemma: DilemmaContext): string[] {
    return [
      `${dilemma.conflictingValues.value2}를 전적으로 우선시하여 보수적 접근`,
      '의사결정을 지연하고 추가 데이터 수집',
      '제3의 대안 탐색을 위한 외부 컨설팅 활용'
    ];
  }

  /**
   * Trade-off 생성 (핵심: 반드시 Gain과 Pain을 동시에 생성)
   */
  private generateTradeOff(action: DecisionAction, dilemma: DilemmaContext): TradeOffResult {
    return {
      gains: {
        description: `${dilemma.timeLimit} 내에 결정을 내려 ${dilemma.stakeholders[0]}의 즉각적인 요구를 충족시켰습니다. 이를 통해 단기적 목표 달성 가능성이 높아지고, 비즈니스 연속성이 유지됩니다.`,
        metrics: [
          '즉각적 위기 해소',
          '주요 이해관계자 만족',
          '비즈니스 연속성 유지',
          '의사결정 속도 입증'
        ]
      },
      pains: {
        description: `그러나 ${dilemma.conflictingValues.value2}를 부분적으로 희생함으로써, ${dilemma.stakeholders.slice(1).join(', ')}로부터 우려와 반발이 예상됩니다. 이는 장기적으로 ${dilemma.conflictingValues.value2.toLowerCase()}에 부정적 영향을 미칠 수 있으며, 향후 유사한 요구가 증가할 선례를 남깁니다.`,
        severity: 'high',
        affectedStakeholders: dilemma.stakeholders.slice(1)
      }
    };
  }

  /**
   * 3단계: 하브루타 압박 질문 생성
   * 발생한 Pain Point를 근거로 지원자를 압박
   */
  private generateHavrutaQuestion(
    tradeOff: TradeOffResult,
    action: DecisionAction,
    questionIndex: number
  ): HavrutaQuestion {
    const questions: HavrutaQuestion[] = [
      {
        question: `당신의 결정으로 인해 "${tradeOff.pains.description}"이라는 부작용이 발생했습니다. 이 부작용을 사전에 예상했습니까? 예상했다면, 왜 이를 감수하기로 결정했습니까?`,
        targetWeakness: '리스크 인지 및 의사결정 근거',
        expectedDefensePoints: [
          '사전 리스크 분석 수행 여부',
          '트레이드오프에 대한 명확한 이해',
          '대안 대비 현재 선택의 우위 근거'
        ]
      },
      {
        question: `${tradeOff.pains.affectedStakeholders.join(', ')}가 불만을 표출하고 있습니다. 이들을 어떻게 설득하시겠습니까? 단순한 해명이 아닌, 데이터나 장기적 관점을 바탕으로 답변해주세요.`,
        targetWeakness: '이해관계자 관리 및 설득 능력',
        expectedDefensePoints: [
          '구체적 데이터 활용',
          '장기적 비전 제시',
          '이해관계자별 맞춤 커뮤니케이션'
        ]
      },
      {
        question: `만약 이 결정이 실패한다면, 당신은 어떤 책임을 지겠습니까? 그리고 실패를 최소화하기 위한 Plan B는 무엇입니까?`,
        targetWeakness: '책임감 및 위기 대응 계획',
        expectedDefensePoints: [
          '명확한 책임 인식',
          '구체적인 대비책 존재',
          '실패 시나리오에 대한 사전 계획'
        ]
      }
    ];

    return questions[questionIndex % questions.length];
  }

  /**
   * 방어 답변 생성
   * 데이터, 장기적 관점, 차선책을 활용한 논리적 방어
   */
  private generateDefenseResponse(
    question: HavrutaQuestion,
    action: DecisionAction,
    tradeOff: TradeOffResult
  ): DefenseResponse {
    // 높은 수준의 방어 답변 시뮬레이션
    const response = this.generateHighQualityDefense(question, action, tradeOff);

    return {
      response: response.text,
      usedEvidence: response.evidence,
      logicalConsistency: response.logicalConsistency,
      emotionalControl: response.emotionalControl
    };
  }

  /**
   * 고품질 방어 답변 생성
   */
  private generateHighQualityDefense(
    question: HavrutaQuestion,
    action: DecisionAction,
    tradeOff: TradeOffResult
  ): {
    text: string;
    evidence: DefenseResponse['usedEvidence'];
    logicalConsistency: number;
    emotionalControl: number;
  } {
    const defenseText = `네, 이 부작용을 사전에 인지하고 있었습니다.

의사결정 과정에서 다음 3가지를 분석했습니다:

1. **데이터 기반 분석**: ${tradeOff.gains.metrics?.[0]}를 통해 얻는 즉각적 가치가, ${tradeOff.pains.description}의 리스크보다 현 시점에서 더 중요하다고 판단했습니다. 특히 ${tradeOff.pains.affectedStakeholders[0]}의 우려는 타당하나, 현재 시장 상황을 고려할 때 속도가 생존을 결정짓는 변수입니다.

2. **장기적 관점**: 이 결정은 단기 전술이지 장기 전략이 아닙니다. 향후 6개월 내에 ${tradeOff.pains.description}를 해소하기 위한 후속 조치를 이미 로드맵에 포함시켰습니다.

3. **차선책 (Plan B)**: ${tradeOff.pains.affectedStakeholders.join(', ')}와의 정기 미팅을 통해 투명하게 진행 상황을 공유하고, 만약 부작용이 예상보다 크게 발생하면 즉시 ${action.consideredAlternatives?.[0] || '대안 전략'}으로 전환할 준비가 되어 있습니다.

완벽한 결정은 없습니다. 다만 현재 가용한 정보와 리소스 내에서 최선의 트레이드오프를 선택했으며, 그 책임은 제가 집니다.`;

    return {
      text: defenseText,
      evidence: {
        dataPoints: tradeOff.gains.metrics,
        longTermPerspective: '6개월 내 후속 조치 계획 수립',
        contingencyPlan: action.consideredAlternatives?.[0] || '대안 전략 전환 준비'
      },
      logicalConsistency: 85,
      emotionalControl: 90
    };
  }

  /**
   * 방어 품질 평가
   */
  private evaluateDefenseQuality(report: LogicDefenseReport): DefenseResult {
    const defenses = report.havrutaPhase.defenses;

    if (defenses.length === 0) return '방어 실패';

    const avgConsistency = defenses.reduce((sum, d) => sum + d.logicalConsistency, 0) / defenses.length;
    const avgEmotional = defenses.reduce((sum, d) => sum + d.emotionalControl, 0) / defenses.length;

    const hasEvidence = defenses.every(d =>
      (d.usedEvidence.dataPoints && d.usedEvidence.dataPoints.length > 0) ||
      d.usedEvidence.longTermPerspective ||
      d.usedEvidence.contingencyPlan
    );

    if (avgConsistency >= 80 && avgEmotional >= 80 && hasEvidence) {
      return '방어 성공';
    } else if (avgConsistency >= 60 && avgEmotional >= 60) {
      return '부분 성공';
    } else {
      return '방어 실패';
    }
  }

  /**
   * 핵심 방어 논리 추출
   */
  private extractLogicHighlights(
    action: DecisionAction,
    tradeOff: TradeOffResult
  ): string[] {
    return [
      `지원자는 "${tradeOff.pains.description}"를 명확히 인지했으나, ${tradeOff.gains.description}를 위해 이를 전략적으로 감수함`,
      `대안으로 "${action.consideredAlternatives?.[0] || '다른 접근법'}"을 제시하여 리스크 발생시 즉시 전환 가능하도록 준비`,
      `${tradeOff.pains.affectedStakeholders.join(', ')}에 대한 사후 관리 계획을 수립하여 장기적 신뢰 유지 노력`
    ];
  }

  /**
   * 4단계: 정량화된 메트릭 생성
   */
  private quantifyMetrics(report: LogicDefenseReport): QuantifiedMetrics {
    const defenses = report.havrutaPhase.defenses;

    // 데이터 기반 사고
    const dataPointsUsed = defenses.filter(d =>
      d.usedEvidence.dataPoints && d.usedEvidence.dataPoints.length > 0
    ).length;
    const dataBasedScore = Math.min(100, (dataPointsUsed / defenses.length) * 100);

    // 위기 대처
    const crisisScore = report.havrutaPhase.defenseQuality === '방어 성공' ? 90 :
                       report.havrutaPhase.defenseQuality === '부분 성공' ? 70 : 50;

    // 비즈니스 인사이트
    const insightTags = this.generateInsightTags(report);
    const insightScore = Math.min(100, insightTags.length * 20);

    // 소통 능력
    const persuasionAttempts = defenses.length;
    const commScore = Math.min(100,
      defenses.reduce((sum, d) => sum + d.emotionalControl, 0) / defenses.length
    );

    // 논리적 방어력
    const logicScore = Math.min(100,
      defenses.reduce((sum, d) => sum + d.logicalConsistency, 0) / defenses.length
    );

    return {
      dataBasedThinking: {
        level: this.scoreToLevel(dataBasedScore),
        evidence: `${dataPointsUsed}회의 답변에서 구체적 데이터 포인트 활용`,
        score: dataBasedScore
      },
      crisisManagement: {
        result: report.havrutaPhase.defenseQuality,
        evidence: `${defenses.length}개의 압박 질문에 대해 ${report.havrutaPhase.defenseQuality}`,
        score: crisisScore
      },
      businessInsight: {
        tags: insightTags,
        evidence: `트레이드오프 이해 및 이해관계자 관리 역량 입증`,
        score: insightScore
      },
      communicationSkill: {
        level: this.scoreToLevel(commScore),
        evidence: `감정적 대응이 아닌 논리적 설득 시도`,
        persuasionAttempts,
        score: commScore
      },
      logicalDefense: {
        consistency: Math.floor(logicScore),
        counterArgumentQuality: Math.floor(logicScore * 0.9),
        score: logicScore
      }
    };
  }

  /**
   * 점수를 레벨로 변환
   */
  private scoreToLevel(score: number): SkillLevel {
    if (score >= 75) return 'High';
    if (score >= 50) return 'Mid';
    return 'Low';
  }

  /**
   * 비즈니스 인사이트 태그 생성
   */
  private generateInsightTags(report: LogicDefenseReport): string[] {
    const tags: string[] = [];

    // Trade-off 분석 기반
    if (report.processLog.tradeOff.pains.severity === 'high') {
      tags.push('#High_Risk_High_Return');
    }

    // 이해관계자 관리
    if (report.processLog.tradeOff.pains.affectedStakeholders.length >= 3) {
      tags.push('#Stakeholder_Management');
    }

    // 데이터 기반
    const hasData = report.havrutaPhase.defenses.some(d =>
      d.usedEvidence.dataPoints && d.usedEvidence.dataPoints.length > 0
    );
    if (hasData) {
      tags.push('#Data_Driven');
    }

    // 장기적 관점
    const hasLongTerm = report.havrutaPhase.defenses.some(d =>
      d.usedEvidence.longTermPerspective
    );
    if (hasLongTerm) {
      tags.push('#Long_Term_Vision');
    }

    // 위기 대응
    if (report.overview.dilemmaContext.timeLimit) {
      tags.push('#Crisis_Response');
    }

    return tags;
  }

  /**
   * AI 총평 생성
   */
  private generateAIEvaluation(report: LogicDefenseReport): AIEvaluation {
    const metrics = report.quantifiedMetrics;
    const overallScore = Math.floor(
      (metrics.dataBasedThinking.score +
       metrics.crisisManagement.score +
       metrics.businessInsight.score +
       metrics.communicationSkill.score +
       metrics.logicalDefense.score) / 5
    );

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const developmentAreas: string[] = [];

    // 강점 분석
    if (metrics.dataBasedThinking.level === 'High') {
      strengths.push('데이터 기반 의사결정: 추상적 주장이 아닌 구체적 지표로 논리를 뒷받침');
    }
    if (metrics.crisisManagement.result === '방어 성공') {
      strengths.push('위기 대응 능력: 압박 상황에서도 논리적 일관성을 유지하며 효과적으로 방어');
    }
    if (metrics.communicationSkill.level === 'High') {
      strengths.push('커뮤니케이션: 감정이 아닌 논리로 이해관계자를 설득하는 능력');
    }

    // 약점 분석
    if (metrics.dataBasedThinking.level === 'Low') {
      weaknesses.push('데이터 활용 부족: 주장을 뒷받침할 구체적 수치나 지표 제시 미흡');
      developmentAreas.push('데이터 분석 및 활용 역량 강화');
    }
    if (metrics.crisisManagement.result === '방어 실패') {
      weaknesses.push('위기 대응 미흡: 압박 질문에 대한 논리적 방어력 부족');
      developmentAreas.push('압박 면접 및 위기 상황 시뮬레이션 훈련');
    }

    // 기본 강점 (항상 포함)
    if (strengths.length === 0) {
      strengths.push('트레이드오프 인식: 완벽한 해답이 없는 상황에서 명확한 선택과 근거 제시');
    }

    const standoutMoments: string[] = [
      `${report.processLog.action.choice}라는 명확한 의사결정`,
      `${report.havrutaPhase.questions.length}개의 압박 질문에 대한 체계적 방어`,
      `${report.processLog.tradeOff.pains.affectedStakeholders.join(', ')}에 대한 사후 관리 계획 수립`
    ];

    return {
      overallScore,
      strengths,
      weaknesses,
      recommendationReason: this.generateRecommendationReason(overallScore, strengths, report),
      developmentAreas,
      standoutMoments
    };
  }

  /**
   * 추천 사유 생성
   */
  private generateRecommendationReason(
    score: number,
    strengths: string[],
    report: LogicDefenseReport
  ): string {
    if (score >= 80) {
      return `${report.overview.jobRole} 직무에 매우 적합한 후보입니다. 특히 ${strengths[0]}는 실무에서 즉시 발휘될 수 있는 강점입니다. 정답이 없는 비즈니스 상황에서 명확한 판단 기준을 가지고 있으며, 그 결정에 대해 논리적으로 방어할 수 있는 역량을 입증했습니다. ${report.processLog.action.choice}와 같은 의사결정은 현장에서의 실무 경험 또는 깊은 사고력을 보여줍니다.`;
    } else if (score >= 60) {
      return `${report.overview.jobRole} 직무를 수행할 기본 역량은 갖추었으나, ${report.aiEvaluation.developmentAreas[0] || '일부 영역'}에서 보완이 필요합니다. 그러나 ${strengths[0]}와 같은 강점은 성장 가능성을 보여주며, 적절한 멘토링과 경험을 통해 빠르게 발전할 수 있을 것으로 예상됩니다.`;
    } else {
      return `${report.overview.jobRole} 직무를 수행하기 위해서는 추가적인 학습과 경험이 필요합니다. 특히 ${report.aiEvaluation.developmentAreas.join(', ')} 영역에서의 역량 강화가 우선시되어야 합니다. 다만 시뮬레이션에 성실히 임한 태도는 긍정적으로 평가됩니다.`;
    }
  }

  /**
   * 저장된 시뮬레이션 조회
   */
  getSimulationById(id: string): LogicDefenseReport | undefined {
    const simulation = this.simulations.get(id);
    return simulation?.getReport();
  }

  /**
   * 모든 시뮬레이션 조회
   */
  getAllSimulations(): LogicDefenseReport[] {
    return Array.from(this.simulations.values()).map(s => s.getReport());
  }

  /**
   * 마크다운 리포트 생성
   */
  generateMarkdownReport(id: string): string | null {
    const simulation = this.simulations.get(id);
    return simulation?.generateMarkdownReport() || null;
  }
}
