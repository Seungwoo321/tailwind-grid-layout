# NPM 배포 설정 가이드

## 필수 설정 사항

### 1. NPM Token 생성
1. [npmjs.com](https://www.npmjs.com) 로그인
2. Account Settings → Access Tokens
3. "Generate New Token" 클릭
4. Type: "Automation" 선택
5. 생성된 토큰 복사

### 2. GitHub Secrets 설정
1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. Name: `NPM_TOKEN`
4. Value: 복사한 NPM 토큰 붙여넣기
5. "Add secret" 클릭

### 3. 브랜치 생성
```bash
# develop 브랜치 생성 (아직 없는 경우)
git checkout -b develop
git push -u origin develop
```

### 4. Package.json 설정 확인
```json
{
  "name": "tailwind-grid-layout",
  "publishConfig": {
    "access": "public"
  }
}
```

## 배포 프로세스

### Beta 배포 (자동)
- develop 브랜치에 푸시하면 자동으로 beta 버전 배포
- 버전 형식: `1.0.0-beta.20250620123456`
- 설치: `npm install tailwind-grid-layout@beta`

### Stable 배포 (자동)
- develop → main PR 머지 시 자동 배포
- Conventional Commits 기반 버전 결정
  - `fix:` → patch (1.0.0 → 1.0.1)
  - `feat:` → minor (1.0.0 → 1.1.0)
  - `BREAKING CHANGE:` → major (1.0.0 → 2.0.0)

## 테스트 방법

1. **로컬 테스트**
   ```bash
   # dry-run으로 확인
   npm publish --dry-run
   ```

2. **Beta 배포 테스트**
   ```bash
   git checkout develop
   git push origin develop
   # GitHub Actions 확인
   ```

3. **Stable 배포 테스트**
   - develop → main PR 생성
   - PR 머지
   - GitHub Actions 확인