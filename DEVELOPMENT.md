# Tailwind Grid Layout 개발 문서

## 프로젝트 개요

React Grid Layout의 모든 기능을 Tailwind CSS로 재구현한 현대적인 대안 라이브러리입니다.

### 주요 특징
- React Grid Layout과 100% 기능 동등성
- Tailwind CSS v4 기반 (CSS-first 접근법)
- TypeScript로 작성
- 제로 의존성 (peer dependencies 제외)
- 트리 쉐이킹 지원
- SSR 지원

## 기술 스택

- **Framework**: React 19.1.0
- **CSS**: Tailwind CSS 4.1.8
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 5
- **Package Manager**: pnpm 10.11.0
- **Testing**: Vitest
- **Documentation**: Storybook 7
- **Linting**: ESLint 9.28.0 (flat config)

## 아키텍처 결정사항

### 1. Tailwind CSS v4 Configuration

#### 라이브러리 코드
- 순수 Tailwind 유틸리티 클래스만 사용
- 커스텀 색상이나 테마 설정 불필요
- `tailwind.config.ts` 없이 동작

#### 예제/데모/문서
- shadcn/ui 컴포넌트 사용을 위해 `tailwind.config.ts` 유지
- CSS 변수 기반 테마 시스템
- `@config` 디렉티브로 명시적 로드

```css
/* src/styles/globals.css */
@import "tailwindcss";
@config "../tailwind.config.ts";
```

### 2. ESLint 9 Flat Config

ESLint 9의 새로운 flat config 형식 채택:

```javascript
// eslint.config.js
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // 커스텀 규칙
)
```

### 3. 컴포넌트 구조

```
src/
├── components/
│   ├── GridContainer.tsx        # 기본 그리드 컨테이너
│   ├── ResponsiveGridContainer.tsx  # 반응형 그리드
│   ├── DroppableGridContainer.tsx   # 드롭 가능 그리드
│   ├── GridItem.tsx            # 그리드 아이템
│   └── ResizeHandle.tsx        # 리사이즈 핸들
├── utils/
│   ├── grid.ts                 # 그리드 계산 로직
│   └── cn.ts                   # 클래스명 유틸리티
└── types/
    └── index.ts                # TypeScript 타입 정의
```

### 4. React Grid Layout 기능 매핑

| React Grid Layout | Tailwind Grid Layout | 상태 |
|-------------------|---------------------|------|
| 드래그 앤 드롭 | `GridContainer` | ✅ |
| 리사이즈 | `ResizeHandle` | ✅ |
| 반응형 브레이크포인트 | `ResponsiveGridContainer` | ✅ |
| 외부 드롭 | `DroppableGridContainer` | ✅ |
| 정적 아이템 | `static` prop | ✅ |
| 충돌 방지 | `preventCollision` | ✅ |
| 경계 제한 | `isBounded` | ✅ |
| 컴팩트 타입 | `compactType` | ✅ |

## 빌드 시스템

### 라이브러리 빌드
```bash
pnpm build:lib
```
- TypeScript 컴파일 및 타입 생성
- Vite로 ES/CJS 번들 생성
- CSS는 JS에 포함 (vite-plugin-css-injected-by-js)

### 개발 모드
```bash
pnpm dev
```
- 라이브러리 watch 모드
- Storybook 개발 서버
- 문서 사이트 개발 서버

## 테스트

```bash
pnpm test          # 테스트 실행
pnpm test:watch    # watch 모드
pnpm test:coverage # 커버리지 리포트
```

## 배포

1. npm 패키지 배포
```bash
pnpm version patch/minor/major
pnpm publish
```

2. 문서 사이트 배포
```bash
pnpm build:docs
# docs-dist/ 폴더를 정적 호스팅에 배포
```

## 주의사항

### Tailwind CSS v4 호환성
- `tailwind.config.ts`는 예제/데모용으로만 사용
- 라이브러리 사용자는 자체 Tailwind 설정 사용 가능
- CSS-first 접근법이지만 backward compatibility 유지

### ESLint 9 요구사항
- 모든 ESLint 플러그인이 v9 호환 버전 필요
- typescript-eslint v8.34.1+ 사용
- flat config 형식 필수

### React 19 호환성
- React 19.1.0 peer dependency
- 새로운 React 기능 활용 가능
- 이전 버전과의 호환성 고려 필요

## 개발 팁

1. **Storybook 사용**
   - 컴포넌트 개발 시 Storybook에서 테스트
   - 모든 props 조합 확인

2. **타입 안정성**
   - TypeScript strict 모드 유지
   - 모든 public API에 타입 정의

3. **성능 최적화**
   - 불필요한 리렌더링 방지
   - useMemo/useCallback 적절히 사용

4. **접근성**
   - 키보드 네비게이션 지원
   - ARIA 속성 적절히 사용

## 문제 해결

### Storybook이 작동하지 않을 때
1. `@tailwindcss/vite` 플러그인 확인
2. CSS import 경로 확인
3. Vite 설정 확인

### 타입 에러 발생 시
1. `tsconfig.json` 설정 확인
2. peer dependencies 버전 확인
3. `pnpm install` 재실행

### 빌드 실패 시
1. Node.js 버전 확인 (>= 20.0.0)
2. pnpm 버전 확인 (>= 10.11.0)
3. 의존성 충돌 확인

## 기여 가이드

1. 이슈 생성 또는 기존 이슈 확인
2. feature 브랜치 생성
3. 코드 작성 및 테스트 추가
4. PR 생성 (모든 테스트 통과 필수)
5. 코드 리뷰 후 머지

## 라이선스

MIT License - Seungwoo, Lee