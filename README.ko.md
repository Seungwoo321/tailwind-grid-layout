# Tailwind Grid Layout

React용 현대적이고 가벼운 그리드 레이아웃 시스템으로, Tailwind CSS로 구축되었습니다. react-grid-layout의 강력한 대안으로 모든 기능을 제공하면서도 더 작은 번들 크기를 자랑합니다.

[![npm version](https://img.shields.io/npm/v/tailwind-grid-layout.svg)](https://www.npmjs.com/package/tailwind-grid-layout)
[![license](https://img.shields.io/npm/l/tailwind-grid-layout.svg)](https://github.com/Seungwoo321/tailwind-grid-layout/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/tailwind-grid-layout)](https://bundlephobia.com/package/tailwind-grid-layout)

> [English](./README.md) | 한국어

## 특징

- 🎯 **react-grid-layout과 완벽한 기능 호환성**
- 🪶 **경량화** - Tailwind CSS를 사용한 더 작은 번들 크기
- 🎨 **Tailwind 네이티브** - Tailwind CSS 유틸리티로 구축
- 📱 **반응형** - 모든 화면 크기에서 작동
- 🔧 **TypeScript** - 완전한 TypeScript 지원
- ⚡ **고성능** - 최적화된 렌더링과 애니메이션
- 🧪 **철저한 테스트** - 100% 테스트 커버리지

## 설치

```bash
npm install tailwind-grid-layout
# 또는
yarn add tailwind-grid-layout
# 또는
pnpm add tailwind-grid-layout
```

### 필수 요구사항

- React 19.1.0
- Tailwind CSS 4.1.8+ (v4 전용 - CSS 우선 구성)
- Node.js 20.0.0+
- pnpm 10.11.0+

## Tailwind CSS v4 설정

이 라이브러리는 새로운 CSS 우선 구성 방식을 사용하는 Tailwind CSS v4가 필요합니다. JavaScript 구성 파일은 필요하지 않습니다.

```css
/* 메인 CSS 파일에서 */
@import "tailwindcss";

/* 선택사항: 커스텀 테마 구성 추가 */
@theme {
  --color-grid-placeholder: oklch(0.7 0.15 210);
  --color-grid-handle: oklch(0.3 0.05 210);
}
```

## 빠른 시작

```tsx
import { GridContainer } from 'tailwind-grid-layout'

const items = [
  { id: '1', x: 0, y: 0, w: 2, h: 2 },
  { id: '2', x: 2, y: 0, w: 2, h: 2 },
  { id: '3', x: 0, y: 2, w: 4, h: 2 }
]

function App() {
  return (
    <GridContainer
      items={items}
      cols={12}
      rowHeight={60}
      onLayoutChange={(newLayout) => console.log(newLayout)}
    >
      {(item) => (
        <div className="bg-blue-500 text-white p-4 rounded">
          Item {item.id}
        </div>
      )}
    </GridContainer>
  )
}
```

## Props 참조

### GridContainer Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|---------|-------------|
| **items** | `GridItem[]` | 필수 | 위치와 크기 정보를 포함한 그리드 아이템 배열 |
| **children** | `(item: GridItem) => ReactNode` | 필수 | 그리드 아이템을 위한 렌더 함수 |
| **cols** | `number` | `12` | 그리드의 열 개수 |
| **rowHeight** | `number` | `60` | 각 행의 높이 (픽셀) |
| **gap** | `number` | `16` | 그리드 아이템 간 간격 (픽셀) |
| **margin** | `[number, number]` | `[gap, gap]` | 아이템 간 여백 [수평, 수직] |
| **containerPadding** | `[number, number]` | `[16, 16]` | 그리드 컨테이너 내부 패딩 [수평, 수직] |
| **maxRows** | `number` | - | 최대 행 개수 |
| **isDraggable** | `boolean` | `true` | 드래그 활성화/비활성화 |
| **isResizable** | `boolean` | `true` | 크기 조정 활성화/비활성화 |
| **preventCollision** | `boolean` | `false` | 아이템 충돌 방지 |
| **allowOverlap** | `boolean` | `false` | 아이템 겹침 허용 |
| **isBounded** | `boolean` | `true` | 컨테이너 경계 내 아이템 유지 |
| **compactType** | `'vertical' \| 'horizontal' \| null` | `'vertical'` | 압축 타입 |
| **resizeHandles** | `Array<'s' \| 'w' \| 'e' \| 'n' \| 'sw' \| 'nw' \| 'se' \| 'ne'>` | `['se']` | 크기 조정 핸들 위치 |
| **draggableCancel** | `string` | - | 드래그를 트리거하지 않을 요소의 CSS 선택자 |
| **className** | `string` | - | 컨테이너에 추가할 CSS 클래스 |
| **onLayoutChange** | `(layout: GridItem[]) => void` | - | 레이아웃 변경 시 콜백 |
| **onDragStart** | `(layout, oldItem, newItem, placeholder, e, element) => void` | - | 드래그 시작 콜백 |
| **onDrag** | `(layout, oldItem, newItem, placeholder, e, element) => void` | - | 드래그 중 콜백 |
| **onDragStop** | `(layout, oldItem, newItem, placeholder, e, element) => void` | - | 드래그 종료 콜백 |
| **onResizeStart** | `(layout, oldItem, newItem, placeholder, e, element) => void` | - | 크기 조정 시작 콜백 |
| **onResize** | `(layout, oldItem, newItem, placeholder, e, element) => void` | - | 크기 조정 중 콜백 |
| **onResizeStop** | `(layout, oldItem, newItem, placeholder, e, element) => void` | - | 크기 조정 종료 콜백 |

### GridItem 속성

| 속성 | 타입 | 필수 | 설명 |
|----------|------|----------|-------------|
| **id** | `string` | ✓ | 아이템의 고유 식별자 |
| **x** | `number` | ✓ | 그리드 단위의 X 위치 |
| **y** | `number` | ✓ | 그리드 단위의 Y 위치 |
| **w** | `number` | ✓ | 그리드 단위의 너비 |
| **h** | `number` | ✓ | 그리드 단위의 높이 |
| **minW** | `number` | - | 최소 너비 |
| **minH** | `number` | - | 최소 높이 |
| **maxW** | `number` | - | 최대 너비 |
| **maxH** | `number` | - | 최대 높이 |
| **isDraggable** | `boolean` | - | 컨테이너의 isDraggable 재정의 |
| **isResizable** | `boolean` | - | 컨테이너의 isResizable 재정의 |
| **static** | `boolean` | - | 아이템을 정적으로 만들기 (이동/크기조정 불가) |
| **className** | `string` | - | 아이템에 추가할 CSS 클래스 |

## react-grid-layout과의 비교

| 기능 | react-grid-layout | tailwind-grid-layout | 비고 |
|---------|-------------------|---------------------|--------|
| **핵심 기능** |
| 드래그 & 드롭 | ✅ | ✅ | 완전 지원 |
| 크기 조정 | ✅ | ✅ | 8방향 크기 조정 |
| 충돌 감지 | ✅ | ✅ | 50% 겹침 규칙 |
| 자동 압축 | ✅ | ✅ | 수직, 수평 또는 없음 |
| 정적 아이템 | ✅ | ✅ | 완전 지원 |
| 경계 내 이동 | ✅ | ✅ | 아이템을 경계 내에 유지 |
| **레이아웃 옵션** |
| 반응형 브레이크포인트 | ✅ | ✅ | ResponsiveGridContainer로 완전 지원 |
| 레이아웃 유지 | ✅ | ✅ | onLayoutChange를 통해 |
| 최소/최대 크기 | ✅ | ✅ | 완전 지원 |
| 충돌 방지 | ✅ | ✅ | 완전 지원 |
| 겹침 허용 | ✅ | ✅ | 완전 지원 |
| **이벤트** |
| 레이아웃 변경 | ✅ | ✅ | 완전 지원 |
| 드래그 이벤트 | ✅ | ✅ | 시작, 이동, 종료 |
| 크기 조정 이벤트 | ✅ | ✅ | 시작, 조정, 종료 |
| 외부에서 드롭 | ✅ | ✅ | DroppableGridContainer로 완전 지원 |
| **스타일링** |
| CSS-in-JS | ✅ | ❌ | Tailwind 사용 |
| 커스텀 클래스 | ✅ | ✅ | 완전 지원 |
| 애니메이션 | ✅ | ✅ | Tailwind 트랜지션 |
| **성능** |
| 번들 크기 | ~30KB | ~15KB | 50% 작음 |
| 의존성 | React만 | React + Tailwind | |
| Tree-shaking | ✅ | ✅ | 완전 지원 |

## 고급 예제

### 커스텀 드래그 핸들

```tsx
<GridContainer items={items}>
  {(item) => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid-drag-handle cursor-move p-2 bg-gray-100 rounded">
        <GripIcon className="w-4 h-4" />
      </div>
      <div className="p-4">
        {item.id}의 콘텐츠
      </div>
    </div>
  )}
</GridContainer>
```

### 정적 아이템

```tsx
const items = [
  { id: '1', x: 0, y: 0, w: 4, h: 2, static: true }, // 이 아이템은 이동할 수 없음
  { id: '2', x: 4, y: 0, w: 4, h: 2 },
]
```

### 반응형 브레이크포인트

```tsx
import { ResponsiveGridContainer } from 'tailwind-grid-layout'

const layouts = {
  lg: [{ id: '1', x: 0, y: 0, w: 3, h: 2 }],
  md: [{ id: '1', x: 0, y: 0, w: 6, h: 2 }],
  sm: [{ id: '1', x: 0, y: 0, w: 12, h: 2 }],
}

<ResponsiveGridContainer
  layouts={layouts}
  breakpoints={{ lg: 1200, md: 768, sm: 480 }}
  cols={{ lg: 12, md: 8, sm: 4 }}
>
  {(item) => <div>반응형 아이템 {item.id}</div>}
</ResponsiveGridContainer>
```

### 외부에서 드래그 앤 드롭

```tsx
import { DroppableGridContainer } from 'tailwind-grid-layout'

<DroppableGridContainer
  items={items}
  onDrop={(newItem) => setItems([...items, newItem])}
  droppingItem={{ w: 2, h: 2 }} // 드롭된 아이템의 기본 크기
>
  {(item) => <div>드롭된 아이템 {item.id}</div>}
</DroppableGridContainer>
```

### 커스텀 크기 조정 핸들

```tsx
<GridContainer
  items={items}
  resizeHandles={['se', 'sw', 'ne', 'nw']} // 모서리 핸들만 활성화
>
  {(item) => <div>아이템 {item.id}</div>}
</GridContainer>
```

### 충돌 방지

```tsx
<GridContainer
  items={items}
  preventCollision={true} // 아이템이 겹칠 수 없음
  allowOverlap={false}
>
  {(item) => <div>아이템 {item.id}</div>}
</GridContainer>
```

### 최대 행 수를 가진 경계 그리드

```tsx
<GridContainer
  items={items}
  isBounded={true}
  maxRows={10} // 그리드를 10행으로 제한
>
  {(item) => <div>아이템 {item.id}</div>}
</GridContainer>
```

## 스타일링 가이드

### Tailwind CSS와 함께 사용하기

이 라이브러리는 Tailwind CSS와 원활하게 작동하도록 제작되었습니다:

```tsx
<GridContainer items={items} className="bg-gray-50 rounded-lg">
  {(item) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="p-4">
        <h3 className="text-lg font-semibold">아이템 {item.id}</h3>
      </div>
    </div>
  )}
</GridContainer>
```

### 커스텀 플레이스홀더

드래그 및 크기 조정 플레이스홀더는 CSS를 통해 스타일링할 수 있습니다:

```css
/* 드래그 플레이스홀더 */
.tailwind-grid-layout .drag-placeholder {
  background: rgba(59, 130, 246, 0.15);
  border: 2px dashed rgb(59, 130, 246);
}

/* 크기 조정 플레이스홀더 */
.tailwind-grid-layout .resize-placeholder {
  background: rgba(59, 130, 246, 0.1);
  border: 2px dashed rgb(59, 130, 246);
}
```

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

## 기여하기

기여를 환영합니다! 자세한 내용은 [기여 가이드](CONTRIBUTING.md)를 참조하세요.

## 라이선스

MIT © [Seungwoo, Lee](./LICENSE)

## 감사의 글

이 라이브러리는 [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout)에서 영감을 받았으며, 현대적이고 Tailwind 우선의 대안을 제공하는 것을 목표로 합니다.