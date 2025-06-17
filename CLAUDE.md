# Claude Code Context for Tailwind Grid Layout

이 문서는 Claude Code가 tailwind-grid-layout 프로젝트를 이해하고 작업할 수 있도록 필요한 컨텍스트를 제공합니다.

## 프로젝트 메타데이터

- **Repository**: https://github.com/Seungwoo321/tailwind-grid-layout
- **Purpose**: React Grid Layout의 Tailwind CSS 기반 대안
- **Created**: 2025년 6월
- **Author**: Seungwoo, Lee (GitHub: @Seungwoo321)

## 중요한 기술적 결정사항

### 1. Tailwind CSS v4 사용
- CSS-first 접근법 채택
- `@import "tailwindcss"` 사용
- `tailwind.config.ts`는 예제/데모용으로만 유지
- 라이브러리 자체는 순수 Tailwind 유틸리티 클래스만 사용

### 2. ESLint 9.28.0 + Flat Config
- 반드시 ESLint 9.28.0 유지 (다운그레이드 금지)
- Flat config 형식 사용 (`eslint.config.js`)
- typescript-eslint v8+ 필요

### 3. 의존성 버전 (etorch-project와 동일)
```json
{
  "react": "19.1.0",
  "tailwindcss": "^4.1.8",
  "typescript": "^5.8.3",
  "eslint": "^9.28.0",
  "pnpm": "10.11.0"
}
```

## 프로젝트 구조

```
tailwind-grid-layout/
├── src/                    # 라이브러리 소스 코드
│   ├── components/         # React 컴포넌트
│   ├── utils/             # 유틸리티 함수
│   ├── types/             # TypeScript 타입
│   └── styles/            # CSS 파일
├── stories/               # Storybook 스토리
├── examples/              # 사용 예제
├── docs/                  # 문서 사이트
├── __tests__/             # 테스트 파일
└── .storybook/            # Storybook 설정
```

## 주요 명령어

```bash
# 개발 (라이브러리 + Storybook + 문서)
pnpm dev

# 빌드
pnpm build         # 전체 빌드
pnpm build:lib     # 라이브러리만
pnpm build:storybook  # Storybook만
pnpm build:docs    # 문서 사이트만

# 테스트
pnpm test
pnpm test:coverage

# 린트
pnpm lint
```

## 작업 시 주의사항

### ✅ 해야 할 것
1. ESLint 9.28.0 버전 유지
2. Tailwind CSS v4 사용
3. TypeScript strict 모드 유지
4. 100% 테스트 커버리지 목표
5. React Grid Layout API 호환성 유지

### ❌ 하지 말아야 할 것
1. ESLint 다운그레이드
2. postcss.config.js 추가 (Tailwind v4에서 불필요)
3. 라이브러리 코드에 커스텀 색상 클래스 사용
4. README 자동 생성 (한글 버전 별도 유지)

## shadcn/ui 통합

- 예제와 데모에서만 사용
- 라이브러리 빌드에는 포함되지 않음
- CSS 변수 기반 테마 시스템 사용
- `components/ui/` 폴더에 위치

## 디버깅 팁

### Storybook 문제
```bash
# Vite 플러그인 확인
# @tailwindcss/vite가 vite.config.ts에 포함되어 있는지 확인
```

### 타입 에러
```bash
# TypeScript 버전 확인
pnpm tsc --version  # 5.8.3 이상

# 타입 체크
pnpm tsc --noEmit
```

### 빌드 문제
```bash
# 클린 빌드
pnpm clean && pnpm install && pnpm build
```

## API 디자인 원칙

1. **React Grid Layout 호환성**
   - 동일한 prop 이름 사용
   - 동일한 동작 구현
   - 마이그레이션 용이성 고려

2. **Tailwind 우선**
   - 스타일링은 Tailwind 클래스로
   - CSS-in-JS 사용 금지
   - 인라인 스타일은 위치 계산에만 사용

3. **타입 안정성**
   - 모든 public API에 타입 정의
   - 제네릭 적절히 활용
   - strict null checks 통과

## 향후 계획

- [ ] React Server Components 지원
- [ ] Tailwind CSS v5 대응 준비
- [ ] 성능 벤치마크 추가
- [ ] 접근성 개선
- [ ] 모바일 터치 지원 강화

## 관련 프로젝트

- **etorch-project**: 이 라이브러리를 사용하는 메인 프로젝트
- **React Grid Layout**: 원본 라이브러리 (기능 참조용)
- **shadcn/ui**: UI 컴포넌트 (데모용)