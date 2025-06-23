import React from 'react'
import { GridContainer, GridItem } from '../src'

export default function XXSTest() {
  const items: GridItem[] = [
    { id: '1', x: 0, y: 0, w: 2, h: 2 },
    { id: '2', x: 0, y: 2, w: 2, h: 2 },
  ]

  return (
    <div className="p-4 max-w-sm mx-auto bg-gray-100">
      <h1 className="text-xl font-bold mb-4">XXS 크기 테스트 (cols=2)</h1>
      
      <div className="bg-white rounded-lg shadow-md">
        <GridContainer
          items={items}
          cols={2}
          rowHeight={100}
          gap={16}
          className="min-h-[400px]"
        >
          {(item) => (
            <div className="h-full w-full bg-blue-500 text-white p-4 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">카드 {item.id}</div>
                <div className="text-sm opacity-75">w={item.w}, h={item.h}</div>
              </div>
            </div>
          )}
        </GridContainer>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>컨테이너 너비: 100%</p>
        <p>카드 너비: w=2 (전체 너비 사용)</p>
        <p>Gap: 16px</p>
      </div>
    </div>
  )
}