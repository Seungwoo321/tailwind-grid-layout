#!/usr/bin/env node
/* eslint-env node */

// Touch functionality verification script
const fs = require('fs');
const path = require('path');

console.log('🔍 Tailwind Grid Layout - 터치 기능 구현 검증\n');

// 1. 터치 이벤트 리스너 확인
const gridItemFile = fs.readFileSync(path.join(__dirname, 'src/components/GridItem.tsx'), 'utf8');
const hasGridItemTouch = gridItemFile.includes('onTouchStart={handleMouseDown}');
console.log(`✅ GridItem 터치 이벤트 리스너: ${hasGridItemTouch ? '구현됨' : '❌ 누락'}`);

// 2. ResizeHandle 터치 지원 확인
const resizeHandleFile = fs.readFileSync(path.join(__dirname, 'src/components/ResizeHandle.tsx'), 'utf8');
const hasResizeTouch = resizeHandleFile.includes('onTouchStart={isActive ? onMouseDown : undefined}');
console.log(`✅ ResizeHandle 터치 지원: ${hasResizeTouch ? '구현됨' : '❌ 누락'}`);

// 3. 글로벌 터치 이벤트 확인
const gridContainerFile = fs.readFileSync(path.join(__dirname, 'src/components/GridContainer.tsx'), 'utf8');
const hasTouchMove = gridContainerFile.includes("addEventListener('touchmove'");
const hasTouchEnd = gridContainerFile.includes("addEventListener('touchend'");
const hasTouchCancel = gridContainerFile.includes("addEventListener('touchcancel'");
console.log(`✅ 글로벌 touchmove 이벤트: ${hasTouchMove ? '구현됨' : '❌ 누락'}`);
console.log(`✅ 글로벌 touchend 이벤트: ${hasTouchEnd ? '구현됨' : '❌ 누락'}`);
console.log(`✅ 글로벌 touchcancel 이벤트: ${hasTouchCancel ? '구현됨' : '❌ 누락'}`);

// 4. 터치 유틸리티 함수 확인
const touchFile = fs.readFileSync(path.join(__dirname, 'src/utils/touch.ts'), 'utf8');
const hasGetControlPosition = touchFile.includes('getControlPosition');
const hasTouchDetection = touchFile.includes("'touches' in e");
console.log(`✅ getControlPosition 함수: ${hasGetControlPosition ? '구현됨' : '❌ 누락'}`);
console.log(`✅ TouchEvent 감지 로직: ${hasTouchDetection ? '구현됨' : '❌ 누락'}`);

// 5. CSS 터치 최적화 확인
const mobileCSS = fs.readFileSync(path.join(__dirname, 'src/styles/mobile.css'), 'utf8');
const hasTouchAction = mobileCSS.includes('touch-action: none');
const hasLargeTouchTargets = mobileCSS.includes('44px');
console.log(`✅ CSS touch-action 설정: ${hasTouchAction ? '구현됨' : '❌ 누락'}`);
console.log(`✅ 모바일 터치 타겟 크기: ${hasLargeTouchTargets ? '44px로 최적화됨' : '❌ 누락'}`);

// 6. touchEventOptions 확인
const hasTouchEventOptions = touchFile.includes('touchEventOptions');
const hasPassiveFalse = touchFile.includes('passive: false');
console.log(`✅ touchEventOptions 설정: ${hasTouchEventOptions ? '구현됨' : '❌ 누락'}`);
console.log(`✅ passive: false 설정: ${hasPassiveFalse ? '구현됨' : '❌ 누락'}`);

// 7. 데모 페이지 모바일 CSS import 확인
const demoStyleFile = fs.readFileSync(path.join(__dirname, 'docs/style.css'), 'utf8');
const hasMobileCSSImport = demoStyleFile.includes('@import "../src/styles/mobile.css"');
console.log(`✅ 데모 페이지 모바일 CSS: ${hasMobileCSSImport ? '적용됨' : '❌ 누락'}`);

// 8. 터치 디버깅 컴포넌트 확인
const showcaseFile = fs.readFileSync(path.join(__dirname, 'examples/showcase/index.tsx'), 'utf8');
const hasTouchTestGrid = showcaseFile.includes('TouchTestGrid');
console.log(`✅ 터치 디버깅 컴포넌트: ${hasTouchTestGrid ? '포함됨' : '❌ 누락'}`);

// 9. HTML 메타 태그 확인
const htmlFile = fs.readFileSync(path.join(__dirname, 'docs/index.html'), 'utf8');
const hasUserScalableNo = htmlFile.includes('user-scalable=no');
const hasTouchOptimization = htmlFile.includes('mobile-web-app-capable');
console.log(`✅ HTML user-scalable=no: ${hasUserScalableNo ? '설정됨' : '❌ 누락'}`);
console.log(`✅ HTML 모바일 최적화: ${hasTouchOptimization ? '설정됨' : '❌ 누락'}`);

console.log('\n📊 터치 기능 구현 상태 요약:');
const checks = [
  hasGridItemTouch,
  hasResizeTouch, 
  hasTouchMove,
  hasTouchEnd,
  hasTouchCancel,
  hasGetControlPosition,
  hasTouchDetection,
  hasTouchAction,
  hasLargeTouchTargets,
  hasTouchEventOptions,
  hasPassiveFalse,
  hasMobileCSSImport,
  hasTouchTestGrid,
  hasUserScalableNo,
  hasTouchOptimization
];

const passedChecks = checks.filter(Boolean).length;
const totalChecks = checks.length;

console.log(`${passedChecks}/${totalChecks} 항목 구현 완료 (${Math.round(passedChecks/totalChecks*100)}%)`);

if (passedChecks === totalChecks) {
  console.log('🎉 모든 터치 기능이 완전히 구현되었습니다!');
} else {
  console.log('⚠️  일부 터치 기능이 누락되었습니다.');
}

console.log('\n🚀 테스트 방법:');
console.log('1. 실제 모바일 기기: http://[컴퓨터IP]:3001/');
console.log('2. Chrome DevTools > Toggle Device Toolbar');
console.log('3. Firefox 반응형 디자인 모드 (권장)');
console.log('4. 터치 이벤트 디버깅 섹션에서 실시간 로그 확인');