# 뚝딱인턴 (Ddukddak Intern) Platform

실무 역량 증명 플랫폼으로, 과제 관리 및 **Logic Defense AI Engine**을 포함합니다.

## 🎯 Logic Defense AI Engine

**Logic Defense AI**는 정답이 없는 비즈니스 상황에서 지원자의 **사고 과정(Process)**과 **논리적 방어력(Logic Defense)**을 검증하고, 보이지 않는 정성적 역량을 **시각화된 데이터(Log)**로 변환하는 핵심 시뮬레이션 엔진입니다.

### 철학

1. **No Perfect Answer** - 모든 결정에는 트레이드오프가 존재
2. **Havruta & Metacognition** - 집요한 질문으로 논리적 허점 발견
3. **Quantification of Qualities** - 정성적 역량의 정량화

### Logic Defense API 빠른 시작

```bash
# 빠른 테스트
curl -X POST http://localhost:3000/api/logic-defense/quick-test \
  -H "Content-Type: application/json" \
  -d '{"jobRole": "마케팅"}'
```

**지원 직무:** 마케팅, 개발자, 기획자, 영업, PM

---

## 📋 Assignment Service

과제 생성 및 관리를 위한 REST API 서비스입니다.

## 기능

- 과제 생성
- 과제 조회 (전체, ID별, 상태별, 담당자별, 생성자별)
- 과제 수정
- 과제 삭제
- 기한 초과 과제 자동 업데이트

## 기술 스택

- Node.js
- TypeScript
- Express.js

## 설치

```bash
npm install
```

## 실행

### 개발 모드
```bash
npm run dev
```

### 빌드 및 실행
```bash
npm run build
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## API 엔드포인트

### 1. 과제 생성
```
POST /api/assignments
```

**요청 본문:**
```json
{
  "title": "과제 제목",
  "description": "과제 설명",
  "dueDate": "2024-12-31T23:59:59Z",
  "createdBy": "user123",
  "assignedTo": "user456",
  "maxScore": 100,
  "attachments": ["file1.pdf", "file2.docx"]
}
```

**응답 (201):**
```json
{
  "id": "uuid",
  "title": "과제 제목",
  "description": "과제 설명",
  "dueDate": "2024-12-31T23:59:59Z",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "status": "pending",
  "createdBy": "user123",
  "assignedTo": "user456",
  "maxScore": 100,
  "attachments": ["file1.pdf", "file2.docx"]
}
```

### 2. 전체 과제 조회
```
GET /api/assignments
```

**쿼리 파라미터 (선택사항):**
- `status`: 상태별 필터링 (pending, in_progress, completed, overdue)
- `assignedTo`: 담당자별 필터링
- `createdBy`: 생성자별 필터링

**예시:**
```
GET /api/assignments?status=pending
GET /api/assignments?assignedTo=user456
GET /api/assignments?createdBy=user123
```

### 3. 특정 과제 조회
```
GET /api/assignments/:id
```

### 4. 과제 수정
```
PUT /api/assignments/:id
```

**요청 본문 (모든 필드 선택사항):**
```json
{
  "title": "수정된 제목",
  "description": "수정된 설명",
  "dueDate": "2024-12-31T23:59:59Z",
  "status": "in_progress",
  "assignedTo": "user789",
  "maxScore": 150,
  "attachments": ["file3.pdf"]
}
```

### 5. 과제 삭제
```
DELETE /api/assignments/:id
```

**응답 (204):** 본문 없음

### 6. 기한 초과 과제 업데이트
```
POST /api/assignments/update-overdue
```

완료되지 않은 과제 중 기한이 지난 과제의 상태를 'overdue'로 업데이트합니다.

### 7. 헬스 체크
```
GET /health
```

## 데이터 모델

### Assignment
```typescript
{
  id: string;                    // UUID
  title: string;                 // 과제 제목
  description: string;           // 과제 설명
  dueDate: Date;                 // 마감일
  createdAt: Date;               // 생성일
  updatedAt: Date;               // 수정일
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignedTo?: string;           // 담당자 ID (선택)
  createdBy: string;             // 생성자 ID
  maxScore?: number;             // 최대 점수 (선택)
  attachments?: string[];        // 첨부파일 목록 (선택)
}
```

## 프로젝트 구조

```
src/
├── types/
│   └── LogicDefense.types.ts      # Logic Defense 타입 정의
├── models/
│   ├── Assignment.ts              # Assignment 데이터 모델
│   └── LogicDefenseSimulation.ts  # Logic Defense 시뮬레이션 모델
├── services/
│   ├── AssignmentService.ts       # Assignment 비즈니스 로직
│   └── LogicDefenseAIService.ts   # Logic Defense AI 엔진
├── controllers/
│   ├── AssignmentController.ts    # Assignment 요청 처리
│   └── LogicDefenseController.ts  # Logic Defense 요청 처리
├── routes/
│   ├── assignment.routes.ts       # Assignment 라우팅
│   └── logicDefense.routes.ts     # Logic Defense 라우팅
└── index.ts                        # 애플리케이션 진입점
```

---

## 🤖 Logic Defense AI 상세 문서

### API 엔드포인트

#### 1. 빠른 테스트 (권장)
```
POST /api/logic-defense/quick-test
```

**요청:**
```json
{
  "jobRole": "마케팅"
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "jobRole": "마케팅",
    "overallScore": 85,
    "defenseQuality": "방어 성공",
    "situation": "신제품 출시 3주 전, 경쟁사가...",
    "decision": "공격적 마케팅 예산 증액...",
    "recommendation": "마케팅 직무에 매우 적합한 후보입니다..."
  }
}
```

#### 2. 전체 시뮬레이션
```
POST /api/logic-defense/simulate
```

**요청:**
```json
{
  "jobRole": "개발자",
  "situationKeywords": ["위기상황", "보안"],
  "candidateId": "user123",
  "difficulty": "hard",
  "options": {
    "includeMultipleQuestions": true,
    "detailLevel": "detailed"
  }
}
```

**지원 옵션:**
- `jobRole`: 마케팅, 개발자, 기획자, 영업, PM
- `difficulty`: easy, medium, hard
- `situationKeywords`: 위기상황, 긴급, 고객불만, 예산부족, 보안

#### 3. 시뮬레이션 조회
```
GET /api/logic-defense/simulations          # 전체 조회
GET /api/logic-defense/simulations/:id      # 개별 조회
GET /api/logic-defense/simulations/:id/markdown  # 마크다운 리포트
```

#### 4. 헬스 체크
```
GET /api/logic-defense/health
```

### 리포트 구조

완전한 시뮬레이션 리포트는 다음을 포함합니다:

1. **시뮬레이션 개요**: 직무, 딜레마 상황, 난이도
2. **의사결정 로그**: 선택한 행동, 트레이드오프 (Gain vs Pain)
3. **하브루타 방어 과정**: AI 압박 질문 및 지원자 방어 답변
4. **핵심 방어 논리**: 하이라이트 추출
5. **정량화된 역량**:
   - 데이터 기반 사고 (점수 0-100)
   - 위기 대처 능력
   - 비즈니스 인사이트 (태그)
   - 소통 능력
   - 논리적 방어력
6. **AI 총평**: 종합 점수, 강점, 약점, 추천 사유

### 시뮬레이션 프로세스

```
1단계: 딜레마 상황 생성
   ↓ (가치관 충돌: 매출 vs 브랜드, 속도 vs 퀄리티)

2단계: 의사결정 & 결과 시뮬레이션
   ↓ (Gain: 즉각적 성과 / Pain: 장기적 리스크)

3단계: AI 압박 면접 (Havruta)
   ↓ ("이 부작용을 예상했습니까?")

4단계: 역량 증명 리포트
   ↓ (정량화된 메트릭 + AI 총평)
```

### 예시 출력

```markdown
# 뚝딱인턴: 로직 디펜스 리포트

## 1. 시뮬레이션 개요
* 직무: 마케팅
* 딜레마: 신제품 출시 3주 전, 경쟁사가 유사 제품 출시...

## 2. 의사결정 로그
* Action: 공격적 마케팅 예산 증액 (ROI 트래킹 조건)
* Trade-off:
  - Gain: 즉각적 위기 해소, 시장 선점
  - Pain: 재무 안정성 우려, CFO 반발

## 3. 하브루타 방어
* 질문: "이 부작용을 예상했습니까?"
* 방어: "네, 데이터 분석 결과 현 시점에서..."

## 5. 정량화된 역량
* 데이터 기반 사고: High (85/100)
* 위기 대처: 방어 성공 (90/100)
* 태그: #Data_Driven #High_Risk_High_Return

## 6. AI 총평
* 종합 점수: 85/100
* 추천 사유: 마케팅 직무에 매우 적합...
```

## 개발

### 빌드
```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

## 라이선스

MIT
