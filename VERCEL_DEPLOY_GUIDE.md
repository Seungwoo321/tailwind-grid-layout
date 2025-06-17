# Vercel 배포 가이드

이 가이드는 tailwind-grid-layout의 예제 페이지를 Vercel에 배포하는 방법을 설명합니다.

## 1. 프로젝트 구조

tailwind-grid-layout은 monorepo 구조로 다음과 같은 프로젝트들을 포함합니다:
- 메인 라이브러리 (루트)
- 예제 애플리케이션 (/examples)
- 문서 사이트 (/docs)
- Storybook (/stories)

## 2. Vercel 프로젝트 설정

### 2.1 기본 설정

Vercel 대시보드에서 프로젝트를 가져올 때 다음과 같이 설정하세요:

| 설정 항목 | 값 |
|---------|---|
| **Framework Preset** | Vite |
| **Root Directory** | `examples` |
| **Build Command** | `cd .. && pnpm install && pnpm build:lib && cd examples && pnpm build` |
| **Output Directory** | `dist` |
| **Install Command** | `pnpm install` |

### 2.2 환경 변수

필요한 경우 다음 환경 변수를 설정하세요:

```
NODE_VERSION=20.x
PNPM_VERSION=10.11.0
```

## 3. 빌드 프로세스 상세 설명

### 3.1 빌드 명령어 분석

```bash
cd .. && pnpm install && pnpm build:lib && cd examples && pnpm build
```

이 명령어는 다음 단계를 수행합니다:

1. **`cd ..`**: 루트 디렉토리로 이동
2. **`pnpm install`**: 전체 프로젝트 의존성 설치
3. **`pnpm build:lib`**: 라이브러리 빌드 (examples가 사용할 패키지 생성)
4. **`cd examples`**: examples 디렉토리로 이동
5. **`pnpm build`**: 예제 애플리케이션 빌드

### 3.2 대체 배포 옵션

#### 옵션 1: Storybook 배포

Storybook을 배포하려면:

| 설정 항목 | 값 |
|---------|---|
| **Root Directory** | `.` (루트) |
| **Build Command** | `pnpm build:storybook` |
| **Output Directory** | `storybook-static` |

#### 옵션 2: 문서 사이트 배포

문서 사이트를 배포하려면:

| 설정 항목 | 값 |
|---------|---|
| **Root Directory** | `docs` |
| **Build Command** | `cd .. && pnpm install && pnpm build:lib && cd docs && pnpm build` |
| **Output Directory** | `out` |

## 4. 주의사항

### 4.1 pnpm 워크스페이스

이 프로젝트는 pnpm 워크스페이스를 사용합니다. Vercel은 자동으로 pnpm을 감지하고 사용합니다.

### 4.2 빌드 순서

라이브러리를 먼저 빌드해야 합니다. examples와 docs는 로컬 라이브러리 패키지에 의존하므로, 라이브러리 빌드 없이는 실패합니다.

### 4.3 Node.js 버전

프로젝트는 Node.js 20.x 이상을 요구합니다. Vercel의 기본 버전이 낮다면 환경 변수에서 설정하세요.

## 5. 배포 후 확인사항

1. **라우팅 확인**: 모든 페이지가 정상적으로 로드되는지 확인
2. **스타일 확인**: Tailwind CSS가 제대로 적용되었는지 확인
3. **인터랙션 확인**: Grid 드래그 앤 드롭이 정상 작동하는지 확인
4. **반응형 확인**: 다양한 화면 크기에서 레이아웃이 제대로 동작하는지 확인

## 6. 트러블슈팅

### 빌드 실패 시

1. **의존성 문제**: `pnpm-lock.yaml` 파일이 최신인지 확인
2. **경로 문제**: Root Directory 설정이 올바른지 확인
3. **메모리 문제**: 빌드 메모리 제한에 걸리면 환경 변수 `NODE_OPTIONS=--max_old_space_size=4096` 추가

### 404 에러

- SPA 라우팅을 위해 `vercel.json` 파일 추가:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 7. CI/CD 설정

GitHub와 연동 시 자동 배포가 설정됩니다:
- `main` 브랜치: Production 배포
- Pull Request: Preview 배포

## 8. 성능 최적화

Vercel의 추가 최적화 옵션:
- Edge Functions 활용
- Image Optimization 설정
- Analytics 활성화

## 배포 URL 예시

배포 완료 후 다음과 같은 URL로 접근 가능합니다:
- Production: `https://your-project.vercel.app`
- Preview: `https://your-project-git-branch-name.vercel.app`