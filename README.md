# Assignment Service

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
├── models/
│   └── Assignment.ts          # 데이터 모델 및 DTO
├── services/
│   └── AssignmentService.ts   # 비즈니스 로직
├── controllers/
│   └── AssignmentController.ts # 요청 처리
├── routes/
│   └── assignment.routes.ts    # 라우팅 설정
└── index.ts                    # 애플리케이션 진입점
```

## 개발

### 빌드
```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

## 라이선스

MIT
