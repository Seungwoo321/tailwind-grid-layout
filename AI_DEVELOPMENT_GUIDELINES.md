# AI 개발 지침 (AI Development Guidelines)

## 목적
이 문서는 Cursor Editor 및 Claude Code에서 AI를 활용한 코드 작업 시 따라야 할 통합 지침을 정의합니다. 본 지침은 2025년 6월 기준으로 작성되었습니다.

## 기본 원칙

### 1. 코드 변경 및 개발 프로세스

#### 1.1 Sequential Thinking 적용
모든 프롬프트 지시사항은 sequential-thinking을 통해 체계적으로 수행합니다. 각 지시사항을 하나의 작업으로 보고 단계별로 접근합니다.

```markdown
## 작업 수행 프로세스
1. 지시사항 분석
   - 요청 내용 파악
   - 필요한 리소스 확인
   - 제약사항 확인

2. 수행 계획 수립
   - 단계별 실행 계획
   - 각 단계 검증 방법
   - 예상 결과물 정의

3. 단계별 실행
   - 계획에 따라 순차 진행
   - 각 단계 완료 후 검증
   - 문제 발생 시 보고

4. 결과 검증 및 보고
   - 실제 실행 결과 확인
   - 요구사항 충족 여부 검증
   - 최종 결과 보고
```

예시:
- "버튼 컴포넌트 생성" → 분석 → 설계 → 구현 → 테스트 → 보고
- "ESLint 오류 수정" → 오류 분석 → 수정 방안 → 승인 → 수정 → 검증
- "문서 작성" → 요구사항 파악 → 구조 설계 → 작성 → 검토

#### 1.2 승인 기반 작업 진행
코드 변경이 필요한 경우 다음 프로세스를 따릅니다:

1. **현재 상황 분석**
   - 문제점 명확히 파악
   - 관련 코드 및 사용처 확인
   - 영향 범위 분석

2. **제안 사항 제시**
   - 변경 필요 이유를 명확한 근거와 함께 설명
   - 여러 해결 방안의 장단점 제시
   - 권장 방향 제안

3. **승인 후 진행**
   - 사용자의 명시적 승인을 받은 후 진행
   - 승인 없이 임의로 코드 변경 금지

### 2. 실제 검증 기반 작업

#### 2.1 서버 및 빌드 검증
모든 수행사항은 실제로 확인한 후 보고합니다:

```bash
# 서버 실행 후 확인
pnpm dev
curl http://localhost:3000

# 빌드 결과물 검증
pnpm build
ls -la dist/
pnpm preview
```

#### 2.2 스타일 및 UI 검증
디자인 시스템과의 충돌, 기존 스타일 덮어쓰기, 반응형 동작 등을 실제로 확인합니다.

#### 2.3 Tailwind CSS v4 스타일링 규칙
Tailwind CSS v4 사용 시 반드시 CSS-first 접근법을 준수합니다:

**기본 원칙:**
- CSS 파일에서 `@import "tailwindcss"` 사용
- 커스텀 스타일은 CSS 파일에 작성
- 컴포넌트 레벨에서는 순수 Tailwind 유틸리티 클래스만 사용

**참조 프로젝트: `/Users/mzc01-swlee/dev/repository/etorch-project`**
```css
/* globals.css 예시 */
@import "tailwindcss";

/* 커스텀 스타일 */
.custom-component {
  @apply bg-blue-500 text-white;
}
```

**금지 사항:**
- CSS-in-JS 사용 금지
- 인라인 스타일 사용 지양 (위치 계산 등 동적 값 제외)
- postcss.config.js 추가 금지 (Tailwind v4에서 불필요)

**다른 방법이 필요한 경우:**
1. context7 MCP 서버를 통해 최신 Tailwind v4 문서 확인
2. 기술적 근거와 해결책 제시
3. 사용자 승인 후 적용

**검증 방법:**
```bash
# 빌드 시 CSS 파일 확인
pnpm build
ls -la dist/assets/*.css

# CSS 충돌 여부 확인
grep -r "@apply" src/
grep -r "style=" src/ --exclude-dir=node_modules
```

#### 2.4 보고 전 필수 검증 절차
작업 완료 후 보고 전에 반드시 수행해야 할 검증 절차:

1. **실제 서버 실행 및 확인**
   - 개발 서버를 백그라운드로 실행 (`pnpm dev &` 또는 별도 터미널)
   - 실제 브라우저나 curl로 직접 접속하여 동작 확인
   - Next.js 서버 로그를 실시간으로 모니터링
   - API 엔드포인트 응답 확인
   - 에러 로그 및 경고 메시지 확인

2. **서버 로그 모니터링**
   ```bash
   # Next.js 개발 서버 실행 및 로그 확인
   pnpm dev
   # 별도 터미널에서 접속 테스트
   curl http://localhost:3000/[페이지경로]
   # 브라우저 개발자 도구 콘솔 확인
   ```
   - 페이지 로드 시 서버 사이드 렌더링 로그 확인
   - 클라이언트 사이드 하이드레이션 에러 확인
   - API 라우트 호출 로그 확인
   - 정적 자원 로딩 에러 확인

3. **직접 확인이 어려운 경우**
   - 빌드를 수행하고 빌드 결과물 검증
   - 빌드된 파일의 존재 여부와 내용 확인
   - 정적 파일 분석을 통한 간접 검증

4. **재확인 지시 대응**
   - 사용자가 다시 확인하라는 지시를 내린 경우
   - 처음부터 모든 작업을 순차적으로 재점검
   - 이전 보고 내용과 실제 상태 간 불일치 파악

5. **코드 레벨 검증**
   - 직접 확인이 불가능한 경우 코드를 1줄씩 검토
   - 잠재적 문제가 될 수 있는 부분 식별
   - 로직 흐름과 데이터 플로우 검증
   - 타입 안정성과 런타임 에러 가능성 확인

#### 2.5 실시간 디버깅을 위한 서버 실행 및 로그 추적
복잡한 문제를 해결하기 위한 체계적인 디버깅 프로세스:

1. **서버 실행 및 로그 파일 생성**
   ```bash
   # 기존 서버 프로세스 확인 및 종료
   ps aux | grep "next dev" | grep -v grep
   kill $(ps aux | grep "next dev" | grep -v grep | awk '{print $2}')
   
   # 로그 파일로 서버 실행
   pnpm dev > /tmp/nextjs-log.txt 2>&1 &
   
   # 포트가 이미 사용 중인 경우 다른 포트로 실행
   pnpm dev --port 3001 > /tmp/nextjs-log-3001.txt 2>&1 &
   ```

2. **접속 로그 추적**
   ```bash
   # 서버 시작 대기
   sleep 3
   
   # 페이지 접속하여 로그 생성
   curl http://localhost:3000/[문제경로] > /dev/null
   
   # 로그 확인
   tail -50 /tmp/nextjs-log.txt
   
   # 에러 필터링
   grep -E "error|Error|warning|Warning|failed|Failed" /tmp/nextjs-log.txt
   ```

3. **무한 루프 및 과도한 로그 관리**
   ```bash
   # 로그 파일 크기 모니터링
   watch -n 1 'ls -lh /tmp/nextjs-log.txt'
   
   # 로그가 너무 빠르게 증가하는 경우
   # 1. 사용자에게 보고
   # 2. 서버 강제 종료
   kill -9 $(ps aux | grep "next dev" | grep -v grep | awk '{print $2}')
   
   # 3. 로그 초기화 후 재시작
   echo "" > /tmp/nextjs-log.txt
   pnpm dev > /tmp/nextjs-log.txt 2>&1 &
   ```

4. **포트 관리**
   ```bash
   # 사용 중인 포트 확인
   lsof -i :3000
   netstat -an | grep 3000
   
   # 특정 포트만 종료
   kill $(lsof -t -i:3000)
   
   # 빈 포트 찾기 (3000-3010 범위)
   for port in {3000..3010}; do
     if ! lsof -i:$port > /dev/null 2>&1; then
       echo "Available port: $port"
       break
     fi
   done
   ```

5. **체계적인 디버깅 사이클**
   - **단계 1**: 서버 실행 → 로그 파일 생성
   - **단계 2**: 문제 재현 → 접속하여 에러 발생
   - **단계 3**: 로그 분석 → 에러 원인 파악
   - **단계 4**: 코드 수정 → 문제 해결
   - **단계 5**: 서버 재시작 → 수정사항 확인
   - **단계 6**: 반복 → 모든 문제 해결까지

6. **로그 분석 팁**
   ```bash
   # 최근 에러만 확인
   tail -f /tmp/nextjs-log.txt | grep -E "error|Error"
   
   # 특정 파일 관련 로그
   grep "CallStackLibrary" /tmp/nextjs-log.txt
   
   # 타임스탬프 추가하여 로그 확인
   tail -f /tmp/nextjs-log.txt | while read line; do echo "$(date '+%Y-%m-%d %H:%M:%S') $line"; done
   ```

### 3. 문서 참조 및 기술 스택 확인

#### 3.1 최신 정보 확인
AI 지식에서 확인되지 않는 기술 스택 버전이나 최신 정보가 필요한 경우:
- **context7 MCP 서버**를 사용하여 최신 문서 참조
- 날짜 검색은 지양하되 필요시 현재 날짜 정확히 확인
- 1-2년 전 과거 데이터 검색 금지

#### 3.2 문서 불일치 처리
지시사항과 기획/설계 문서 간 불일치 발생 시:
1. 작업 중단
2. 원인 분석 및 근거 제시
3. AI 의견 제시 (최종 결정권은 사용자)
4. 승인 후 진행

### 4. 명확한 의사소통

#### 4.1 의도 확인
지시자의 의도가 불분명한 경우:
- 작업 중단하고 재확인
- 단계적으로 구체적인 질문
- 명확한 이해 후 작업 진행

#### 4.2 근거 기반 보고
```markdown
// 좋은 예시
"grep 검색 결과 RendererDefinition의 renderer 속성이 사용되지 않습니다.
[검색 결과 첨부]
따라서 제거를 제안합니다."

// 나쁜 예시  
"이 속성은 필요 없어 보입니다."
```

## 개발 작업 가이드라인

### 1. 신규 기능 개발

프롬프트로 신규 기능 개발을 지시받은 경우의 작업 수행 방법입니다.

#### 작업 수행 단계
1. **지시사항 분석**
   - 요청된 기능 명확히 파악
   - 기존 코드베이스와의 연관성 확인
   - 불명확한 부분 질문

2. **설계 및 검토 요청**
   - 컴포넌트 구조 제안
   - API 인터페이스 설계
   - 구현 방향 승인 요청

3. **단계별 구현**
   - 기본 구조 → 동작 확인 → 보고
   - 핵심 로직 → 테스트 → 보고
   - 스타일링 → UI 검증 → 보고

4. **최종 검증**
   - 통합 테스트 실행
   - 실제 동작 확인
   - 완료 보고

### 2. 기존 코드 수정 및 리팩토링

#### 분석 단계
```bash
# 사용처 확인
grep -n "targetFunction" src/**/*.ts

# 의존성 확인  
pnpm list targetPackage

# 영향 범위 파악
```

#### 수정 단계
1. 한 번에 하나의 문제만 해결
2. 각 변경사항 테스트
3. 결과 보고 후 다음 진행

### 3. 테스트 및 검증

#### 필수 검증 명령어
```bash
pnpm lint      # ESLint 검사
pnpm typecheck # TypeScript 타입 체크  
pnpm test      # 테스트 실행
pnpm build:all # 전체 빌드
```

#### 검증 결과 보고
```markdown
## 검증 완료
- ESLint: 에러 0개, 경고 0개 ✅
- TypeScript: 타입 에러 없음 ✅
- 테스트: 152개 통과 ✅
- 빌드: 성공 (10.2MB) ✅
```

## Git 작업 규칙

### 브랜치 전략
- develop 브랜치에서 시작
- feature/*, fix/*, chore/* 등 목적별 브랜치명
- PR은 develop 브랜치로 생성
- main 브랜치 직접 PR 금지

### 커밋 규칙
커밋 전 다음 사항을 확인하고 승인받습니다:
```markdown
변경사항: GitHub Actions 워크플로우 수정
커밋 메시지: "fix: CI 빌드 오류 수정"
커밋해도 될까요?
```

## 파일 및 문서 관리

### 임시 파일 관리
개발 중 생성한 임시 파일은 작업 종료 시 삭제:
- 테스트용 임시 파일
- 검증용 문서
- 불필요한 console.log
- 테스트 데이터

로그 파일 생성 시 프로젝트별 경로 구분:
```bash
# 로그 파일 경로 예시
/tmp/[프로젝트명]/debug-[날짜].log
/tmp/tailwind-grid-layout/build-20250621.log

# 이전 로그 파일 정리
rm -f /tmp/[프로젝트명]/*.log  # 필요없는 경우
```

로그 파일 관리 원칙:
- 프로젝트명으로 디렉토리 생성하여 구분
- 날짜나 용도를 파일명에 포함
- 작업 시작 시 이전 로그 파일 확인 및 정리
- 작업 완료 후 불필요한 로그 삭제

### 문서 업데이트
문서 수정 시 자연스러운 흐름 유지:
- 섹션 추가가 아닌 전체 맥락에 맞게 통합
- "추가", "보완" 등의 문구 사용 금지
- 처음부터 작성된 것처럼 일관된 톤 유지

## MCP 서버 활용

### sequential-thinking 서버
- 복잡한 문제 해결
- 다단계 작업 계획
- 의존성 분석

### context7 서버  
- 최신 기술 문서 확인
- API 레퍼런스 조회
- 보안 이슈 검토

### Task 도구
- 다중 파일 검색
- 코드 패턴 분석
- 영향 범위 파악

## 금지 사항

1. **무단 변경**: 승인 없는 코드 수정
2. **추측 기반 작업**: 실제 확인 없는 보고
3. **임의 결정**: 불확실한 사항 독단 처리
4. **의존성 다운그레이드**: 호환성 검증 없는 버전 변경
5. **강제 Git 작업**: --force 옵션 사용
6. **성공 기준 임의 수정**: 사용자가 지정한 성공 기준(테스트 커버리지 임계값 등)을 AI 마음대로 변경 금지

## 오류 처리

예상치 못한 오류 발생 시:
1. 즉시 작업 중단
2. 오류 내용 및 원인 분석
3. 해결 방안 제시
4. 승인 후 진행

이 지침을 통해 안전하고 효율적인 AI 활용 개발을 수행합니다.