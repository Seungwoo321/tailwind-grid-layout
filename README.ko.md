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
- 📱 **모바일 터치** - 향상된 제스처 지원으로 터치 디바이스 완전 최적화
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
| **draggableHandle** | `string` | - | 드래그 핸들용 CSS 선택자 |
| **autoSize** | `boolean` | `true` | 모든 아이템에 맞게 컨테이너 높이 자동 조정 |
| **verticalCompact** | `boolean` | `true` | 더 이상 사용되지 않음: compactType 사용 |
| **transformScale** | `number` | `1` | 확대/축소 시 드래그/크기 조정을 위한 스케일 팩터 |
| **droppingItem** | `Partial<GridItem>` | - | 외부에서 드래그 중 미리보기 아이템 |
| **className** | `string` | - | 컨테이너에 추가할 CSS 클래스 |
| **style** | `React.CSSProperties` | - | 컨테이너용 인라인 스타일 |
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

### ResponsiveGridContainer Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|---------|-------------|
| **layouts** | `BreakpointLayouts` | 필수 | 각 브레이크포인트별 레이아웃 객체 |
| **breakpoints** | `{ [breakpoint: string]: number }` | `{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }` | 각 브레이크포인트의 최소 너비 |
| **cols** | `{ [breakpoint: string]: number }` | `{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }` | 각 브레이크포인트의 열 개수 |
| **onLayoutChange** | `(layout: GridItem[], layouts: BreakpointLayouts) => void` | - | 레이아웃 변경 시 현재 레이아웃과 모든 레이아웃을 전달하는 콜백 |
| **onBreakpointChange** | `(newBreakpoint: string, cols: number) => void` | - | 브레이크포인트 변경 시 호출되는 콜백 |
| **width** | `number` | - | 컨테이너 너비 (WidthProvider가 제공) |
| ...GridContainerProps | - | - | items, cols, onLayoutChange를 제외한 모든 GridContainer props |

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
| 반응형 브레이크포인트 | ✅ | ✅ | ResizeObserver를 통한 실시간 반응형 레이아웃 |
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
| 번들 크기 | ~30KB | ~22KB (gzip) | 더 작은 번들 |
| 의존성 | React만 | React + Tailwind | |
| Tree-shaking | ✅ | ✅ | 완전 지원 |

## 고급 예제

### 커스텀 드래그 핸들

```tsx
<GridContainer items={items}>
  {(item) => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="cursor-move p-2 bg-gray-100 rounded" data-drag-handle>
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
import { ResponsiveGridContainer, WidthProvider } from 'tailwind-grid-layout'

// 각 브레이크포인트별 레이아웃 정의
const layouts = {
  lg: [
    { id: '1', x: 0, y: 0, w: 6, h: 2 },
    { id: '2', x: 6, y: 0, w: 6, h: 2 },
    { id: '3', x: 0, y: 2, w: 4, h: 2 },
    { id: '4', x: 4, y: 2, w: 8, h: 2 }
  ],
  md: [
    { id: '1', x: 0, y: 0, w: 10, h: 2 },
    { id: '2', x: 0, y: 2, w: 10, h: 2 },
    { id: '3', x: 0, y: 4, w: 5, h: 2 },
    { id: '4', x: 5, y: 4, w: 5, h: 2 }
  ],
  sm: [
    { id: '1', x: 0, y: 0, w: 6, h: 2 },
    { id: '2', x: 0, y: 2, w: 6, h: 2 },
    { id: '3', x: 0, y: 4, w: 6, h: 2 },
    { id: '4', x: 0, y: 6, w: 6, h: 2 }
  ],
  xs: [
    { id: '1', x: 0, y: 0, w: 4, h: 2 },
    { id: '2', x: 0, y: 2, w: 4, h: 2 },
    { id: '3', x: 0, y: 4, w: 4, h: 2 },
    { id: '4', x: 0, y: 6, w: 4, h: 2 }
  ],
  xxs: [
    { id: '1', x: 0, y: 0, w: 2, h: 2 },
    { id: '2', x: 0, y: 2, w: 2, h: 2 },
    { id: '3', x: 0, y: 4, w: 2, h: 2 },
    { id: '4', x: 0, y: 6, w: 2, h: 2 }
  ]
}

// 옵션 1: 수동 너비 추적
function ResponsiveExample() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg')
  
  return (
    <ResponsiveGridContainer
      layouts={layouts}
      onBreakpointChange={(breakpoint) => {
        setCurrentBreakpoint(breakpoint)
        console.log(`${breakpoint} 브레이크포인트로 전환됨`)
      }}
      onLayoutChange={(layout, allLayouts) => {
        // 레이아웃을 상태나 백엔드에 저장
        console.log('레이아웃 변경됨:', allLayouts)
      }}
    >
      {(item) => (
        <div className="bg-blue-500 text-white p-4 rounded">
          아이템 {item.id}
        </div>
      )}
    </ResponsiveGridContainer>
  )
}

// 옵션 2: WidthProvider를 사용한 자동 너비 감지
const ResponsiveGridWithWidth = WidthProvider(ResponsiveGridContainer)

function App() {
  return (
    <ResponsiveGridWithWidth
      layouts={layouts}
      // 커스텀 브레이크포인트 (선택사항)
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      // 커스텀 열 구성 (선택사항)
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    >
      {(item) => <div>아이템 {item.id}</div>}
    </ResponsiveGridWithWidth>
  )
}
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

### AutoSize 컨테이너

```tsx
<GridContainer
  items={items}
  autoSize={true} // 컨테이너 높이가 자동으로 조정됨
>
  {(item) => <div>아이템 {item.id}</div>}
</GridContainer>

// 고정 높이
<div style={{ height: 400, overflow: 'auto' }}>
  <GridContainer
    items={items}
    autoSize={false}
    style={{ height: '100%' }}
  >
    {(item) => <div>아이템 {item.id}</div>}
  </GridContainer>
</div>
```

### 실시간 반응형 업데이트

반응형 그리드는 윈도우 크기가 조정될 때 자동으로 레이아웃을 업데이트하며, 최적의 성능을 위해 디바운스 처리됩니다:

```tsx
import { ResponsiveGridContainer } from 'tailwind-grid-layout'

function DashboardExample() {
  const [layouts, setLayouts] = useState({
    lg: dashboardLayoutLg,
    md: dashboardLayoutMd,
    sm: dashboardLayoutSm,
    xs: dashboardLayoutXs,
    xxs: dashboardLayoutXxs
  })
  const [currentBreakpoint, setCurrentBreakpoint] = useState('')
  const [currentCols, setCurrentCols] = useState(12)

  return (
    <>
      {/* 시각적 브레이크포인트 표시기 */}
      <div className="mb-4 p-2 bg-green-100 rounded">
        현재: {currentBreakpoint} ({currentCols}열)
      </div>
      
      <ResponsiveGridContainer
        layouts={layouts}
        onLayoutChange={(layout, allLayouts) => {
          setLayouts(allLayouts)
        }}
        onBreakpointChange={(breakpoint, cols) => {
          setCurrentBreakpoint(breakpoint)
          setCurrentCols(cols)
        }}
        rowHeight={100}
        gap={16}
        containerPadding={[16, 16]}
      >
        {(item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {item.content}
            </CardContent>
          </Card>
        )}
      </ResponsiveGridContainer>
    </>
  )
}
```

### DroppingItem 미리보기

```tsx
<DroppableGridContainer
  items={items}
  droppingItem={{ w: 4, h: 2 }} // 드래그 중 미리보기 표시
  onDrop={(newItem) => setItems([...items, newItem])}
>
  {(item) => <div>아이템 {item.id}</div>}
</DroppableGridContainer>
```

## 레이아웃 유틸리티

### generateLayouts

단일 레이아웃 정의에서 모든 브레이크포인트에 대한 동일한 레이아웃을 생성합니다.

```tsx
import { generateLayouts } from 'tailwind-grid-layout'

const items = [
  { id: '1', x: 0, y: 0, w: 4, h: 2 },
  { id: '2', x: 4, y: 0, w: 4, h: 2 }
]

// lg, md, sm, xs, xxs에 대해 동일한 위치로 레이아웃 생성
const layouts = generateLayouts(items)
```

### generateResponsiveLayouts

브레이크포인트별 다른 컬럼 수에 맞게 레이아웃을 자동으로 조정합니다.

```tsx
import { generateResponsiveLayouts } from 'tailwind-grid-layout'

const items = [
  { id: '1', x: 0, y: 0, w: 12, h: 2 },
  { id: '2', x: 0, y: 2, w: 6, h: 2 }
]

// 컬럼 제약에 맞게 아이템 너비와 위치를 조정
const layouts = generateResponsiveLayouts(items, {
  lg: 12,
  md: 10, 
  sm: 6,
  xs: 4,
  xxs: 2
})
```

### WidthProvider HOC

최적의 성능을 위해 ResizeObserver를 사용하여 ResponsiveGridContainer에 컨테이너 너비를 자동으로 제공합니다.

```tsx
import { ResponsiveGridContainer, WidthProvider } from 'tailwind-grid-layout'

const ResponsiveGridWithWidth = WidthProvider(ResponsiveGridContainer)

// 기본 사용법
<ResponsiveGridWithWidth
  layouts={layouts}
  rowHeight={100}
>
  {(item) => <div>아이템 {item.id}</div>}
</ResponsiveGridWithWidth>

// 초기 렌더링 시 레이아웃 변경을 방지하는 measureBeforeMount 사용
<ResponsiveGridWithWidth
  layouts={layouts}
  measureBeforeMount={true}
  rowHeight={100}
>
  {(item) => <div>아이템 {item.id}</div>}
</ResponsiveGridWithWidth>

// WidthProvider 기능:
// - 효율적인 너비 감지를 위해 ResizeObserver 사용
// - ResizeObserver를 사용할 수 없는 경우 window resize 이벤트로 대체
// - measureBeforeMount 옵션으로 SSR을 올바르게 처리
// - 더 나은 성능을 위한 디바운스된 리사이즈 처리 (150ms)
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

## 성능 최적화

- **하드웨어 가속**: will-change와 함께 CSS transform 사용
- **제스처 디바운싱**: 최적화된 터치 이벤트 처리
- **메모리 관리**: 이벤트 리스너의 적절한 정리
- **번들 분할**: Tree-shakable exports
- **ResizeObserver**: 효율적인 컨테이너 너비 감지
- **애니메이션 제어**: 상호작용 중 트랜지션 비활성화

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)
- **Mobile Safari** (iOS 12+)
- **Chrome Mobile** (Android 7+)
- **ResizeObserver 지원**이 최적 성능을 위해 필요

## 기여하기

기여를 환영합니다! 자세한 내용은 [기여 가이드](CONTRIBUTING.md)를 참조하세요.

## 라이선스

MIT © [Seungwoo, Lee](./LICENSE)

## 감사의 글

이 라이브러리는 [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout)에서 영감을 받았으며, 현대적이고 Tailwind 우선의 대안을 제공하는 것을 목표로 합니다.