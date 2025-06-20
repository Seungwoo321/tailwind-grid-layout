import { j as jsxDevRuntimeExports } from './jsx-dev-runtime-BOfTfjLc.js';
import { r as reactExports } from './index-BjJjVscZ.js';
import { c as cn } from './ResizeHandle-DnYSTVAO.js';
import { GridItemComponent } from './GridItem-DXm8-s75.js';

function calculateGridPosition(x, y, cols, rowHeight, gap, containerWidth, margin) {
  const horizontalMargin = margin ? margin[0] : gap;
  const verticalMargin = margin ? margin[1] : gap;
  const colWidth = (containerWidth - horizontalMargin * (cols - 1)) / cols;
  const col = Math.round(x / (colWidth + horizontalMargin));
  const row = Math.round(y / (rowHeight + verticalMargin));
  return {
    col: Math.max(0, col),
    row: Math.max(0, row)
  };
}
function getPixelPosition(item, cols, rowHeight, gap, containerWidth, margin) {
  const horizontalMargin = margin ? margin[0] : gap;
  const verticalMargin = margin ? margin[1] : gap;
  const colWidth = (containerWidth - horizontalMargin * (cols - 1)) / cols;
  return {
    left: item.x * (colWidth + horizontalMargin),
    top: item.y * (rowHeight + verticalMargin),
    width: item.w * colWidth + (item.w - 1) * horizontalMargin,
    height: item.h * rowHeight + (item.h - 1) * verticalMargin
  };
}
function checkCollision(item1, item2) {
  return !(item1.x + item1.w <= item2.x || item2.x + item2.w <= item1.x || item1.y + item1.h <= item2.y || item2.y + item2.h <= item1.y);
}
function findFreeSpace(items, itemToPlace, cols, excludeId) {
  const itemsToCheck = excludeId ? items.filter((item) => item.id !== excludeId) : items;
  const hasCollisionAtOriginal = itemsToCheck.some(
    (item) => checkCollision(itemToPlace, item)
  );
  if (!hasCollisionAtOriginal) {
    return itemToPlace;
  }
  let y = itemToPlace.y;
  while (true) {
    for (let x = 0; x <= cols - itemToPlace.w; x++) {
      const testPosition = { ...itemToPlace, x, y };
      const hasCollision = itemsToCheck.some(
        (item) => checkCollision(testPosition, item)
      );
      if (!hasCollision) {
        return testPosition;
      }
    }
    y++;
  }
}
function compactLayout(items, cols, compactType = "vertical") {
  if (!compactType) return items;
  const staticItems = items.filter((item) => item.static);
  const nonStaticItems = items.filter((item) => !item.static);
  const sorted = [...nonStaticItems].sort((a, b) => {
    if (compactType === "horizontal") {
      if (a.x === b.x) return a.y - b.y;
      return a.x - b.x;
    } else {
      if (a.y === b.y) return a.x - b.x;
      return a.y - b.y;
    }
  });
  const compacted = [...staticItems];
  sorted.forEach((item) => {
    if (compactType === "vertical") {
      let minY = 0;
      let found = false;
      for (let y = 0; !found; y++) {
        const testItem = { ...item, y, x: item.x };
        const hasCollision = compacted.some(
          (placed) => checkCollision(testItem, placed)
        );
        if (!hasCollision) {
          minY = y;
          found = true;
        }
      }
      compacted.push({ ...item, y: minY });
    } else if (compactType === "horizontal") {
      let minX = 0;
      let found = false;
      for (let x = 0; x <= cols - item.w && !found; x++) {
        const testItem = { ...item, x, y: item.y };
        const hasCollision = compacted.some(
          (placed) => checkCollision(testItem, placed)
        );
        if (!hasCollision) {
          minX = x;
          found = true;
        }
      }
      compacted.push({ ...item, x: minX });
    }
  });
  return compacted;
}
function moveItems(layout, item, _cols, _originalItem) {
  const compareWith = { ...item };
  let movedLayout = [...layout];
  const itemIndex = movedLayout.findIndex((l) => l.id === item.id);
  if (itemIndex !== -1) {
    movedLayout[itemIndex] = compareWith;
  }
  const getCollisions = (checkItem) => {
    return movedLayout.filter((l) => {
      if (l.id === checkItem.id || l.static) return false;
      return checkCollision(checkItem, l);
    });
  };
  const processedIds = /* @__PURE__ */ new Set();
  const itemsToMove = [compareWith];
  while (itemsToMove.length > 0) {
    const currentItem = itemsToMove.shift();
    if (processedIds.has(currentItem.id)) continue;
    processedIds.add(currentItem.id);
    const collisions = getCollisions(currentItem);
    for (const collision of collisions) {
      if (processedIds.has(collision.id)) continue;
      const newY = currentItem.y + currentItem.h;
      const movedCollision = { ...collision, y: newY };
      const collisionIndex = movedLayout.findIndex((l) => l.id === collision.id);
      if (collisionIndex !== -1) {
        movedLayout[collisionIndex] = movedCollision;
        itemsToMove.push(movedCollision);
      }
    }
  }
  return movedLayout;
}
function getAllCollisions(layout, item) {
  return layout.filter((l) => l.id !== item.id && checkCollision(l, item));
}

"use client";
const GridContainer = ({
  cols = 12,
  rowHeight = 60,
  gap = 16,
  margin,
  containerPadding = [16, 16],
  maxRows,
  isDraggable = true,
  isResizable = true,
  preventCollision = false,
  allowOverlap = false,
  isBounded = true,
  compactType = "vertical",
  resizeHandles = ["se"],
  draggableCancel,
  autoSize = true,
  verticalCompact: _verticalCompact = true,
  transformScale: _transformScale = 1,
  droppingItem,
  onLayoutChange,
  onDragStart,
  onDrag,
  onDragStop,
  onResizeStart,
  onResize,
  onResizeStop,
  onDrop: _onDrop,
  items,
  children,
  className,
  style
}) => {
  const containerRef = reactExports.useRef(null);
  const [containerWidth, setContainerWidth] = reactExports.useState(0);
  const [layout, setLayout] = reactExports.useState(items);
  const [dragState, setDragState] = reactExports.useState({
    isDragging: false,
    draggedItem: null,
    dragOffset: { x: 0, y: 0 },
    placeholder: null,
    originalPosition: null,
    currentMousePos: void 0
  });
  const [resizeState, setResizeState] = reactExports.useState({
    isResizing: false,
    resizedItem: null,
    resizeHandle: null,
    startSize: { w: 0, h: 0 },
    startPos: { x: 0, y: 0 }
  });
  reactExports.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - containerPadding[0] * 2);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [containerPadding]);
  reactExports.useEffect(() => {
    setLayout((prevLayout) => {
      const existingItemsMap = new Map(prevLayout.map((item) => [item.id, item]));
      const mergedLayout = items.map((item) => {
        const existing = existingItemsMap.get(item.id);
        if (existing) {
          return {
            ...item,
            x: existing.x,
            y: existing.y,
            w: existing.w,
            h: existing.h
          };
        }
        return item;
      });
      return compactLayout(mergedLayout, cols, compactType);
    });
  }, [items, cols, compactType]);
  const updateLayout = reactExports.useCallback((newLayout) => {
    const compacted = compactLayout(newLayout, cols, compactType);
    setLayout(compacted);
    onLayoutChange?.(compacted);
  }, [cols, compactType, onLayoutChange]);
  const handleDragStart = reactExports.useCallback((itemId, e) => {
    const item = layout.find((i) => i.id === itemId);
    const rect = e.currentTarget.getBoundingClientRect();
    const newDragState = {
      isDragging: true,
      draggedItem: itemId,
      dragOffset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      },
      placeholder: { ...item },
      originalPosition: { ...item },
      currentMousePos: { x: e.clientX, y: e.clientY }
    };
    setDragState(newDragState);
    if (onDragStart) {
      const element = e.currentTarget;
      onDragStart(layout, item, item, { ...item }, e.nativeEvent, element);
    }
    e.preventDefault();
  }, [isDraggable, layout, onDragStart]);
  const handleDragMove = reactExports.useCallback((e) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left - dragState.dragOffset.x - containerPadding[0];
    const y = e.clientY - containerRect.top - dragState.dragOffset.y - containerPadding[1];
    const { col, row } = calculateGridPosition(x, y, cols, rowHeight, gap, containerWidth, margin);
    const draggedItem = layout.find((i) => i.id === dragState.draggedItem);
    if (!draggedItem || draggedItem.static) return;
    let newPosition = {
      x: Math.max(0, Math.min(cols - draggedItem.w, col)),
      y: Math.max(0, row),
      w: draggedItem.w,
      h: draggedItem.h
    };
    if (maxRows && newPosition.y + newPosition.h > maxRows) {
      newPosition.y = Math.max(0, maxRows - newPosition.h);
    }
    if (isBounded) {
      newPosition.x = Math.max(0, Math.min(cols - newPosition.w, newPosition.x));
      newPosition.y = Math.max(0, newPosition.y);
    }
    const tempLayout = layout.map(
      (item) => item.id === dragState.draggedItem ? { ...item, ...newPosition } : item
    );
    if (preventCollision && !allowOverlap) {
      const collisions = getAllCollisions(tempLayout, { ...draggedItem, ...newPosition });
      const staticCollisions = collisions.filter((item) => item.static);
      if (staticCollisions.length > 0) {
        return;
      }
    }
    let finalLayout = tempLayout;
    if (!preventCollision && !allowOverlap) {
      const itemWithNewPosition = { ...draggedItem, ...newPosition };
      const originalPosition = dragState.originalPosition;
      const originalWithId = { ...draggedItem, ...originalPosition };
      finalLayout = moveItems(tempLayout, itemWithNewPosition, cols, originalWithId);
    }
    const compactedLayout = compactLayout(finalLayout, cols, compactType);
    setLayout(compactedLayout);
    setDragState((prev) => ({
      ...prev,
      placeholder: newPosition,
      currentMousePos: { x: e.clientX, y: e.clientY }
    }));
    if (onDrag && dragState.originalPosition) {
      const element = containerRef.current?.querySelector(`[data-grid-id="${dragState.draggedItem}"]`);
      if (element) {
        onDrag(compactedLayout, { ...draggedItem, ...dragState.originalPosition }, { ...draggedItem, ...newPosition }, { ...draggedItem, ...newPosition }, e, element);
      }
    }
  }, [dragState, layout, cols, rowHeight, gap, containerWidth, containerPadding, preventCollision, allowOverlap, isBounded, compactType, margin, maxRows, onDrag]);
  const handleDragEnd = reactExports.useCallback((e) => {
    const draggedItem = layout.find((i) => i.id === dragState.draggedItem);
    if (draggedItem && onDragStop && dragState.originalPosition) {
      const element = containerRef.current?.querySelector(`[data-grid-id="${dragState.draggedItem}"]`);
      if (element) {
        onDragStop(layout, { ...draggedItem, ...dragState.originalPosition }, draggedItem, { ...draggedItem, ...dragState.placeholder }, e, element);
      }
    }
    updateLayout(layout);
    setDragState({
      isDragging: false,
      draggedItem: null,
      dragOffset: { x: 0, y: 0 },
      placeholder: null,
      originalPosition: null,
      currentMousePos: void 0
    });
  }, [dragState, layout, updateLayout, onDragStop]);
  const handleResizeStart = reactExports.useCallback((itemId, handle, e) => {
    const item = layout.find((i) => i.id === itemId);
    setResizeState({
      isResizing: true,
      resizedItem: itemId,
      resizeHandle: handle,
      startSize: { w: item.w, h: item.h },
      startPos: { x: e.clientX, y: e.clientY },
      originalPos: { x: item.x, y: item.y }
    });
    if (onResizeStart) {
      const element = e.currentTarget;
      onResizeStart(layout, item, item, { ...item }, e.nativeEvent, element);
    }
    e.preventDefault();
    e.stopPropagation();
  }, [isResizable, layout, onResizeStart]);
  const handleResizeMove = reactExports.useCallback((e) => {
    const item = layout.find((i) => i.id === resizeState.resizedItem);
    if (!item) return;
    const horizontalMargin = margin ? margin[0] : gap;
    const verticalMargin2 = margin ? margin[1] : gap;
    const colWidth = (containerWidth - horizontalMargin * (cols - 1)) / cols;
    const deltaX = e.clientX - resizeState.startPos.x;
    const deltaY = e.clientY - resizeState.startPos.y;
    const threshold = 0.3;
    const gridDeltaX = deltaX / (colWidth + horizontalMargin);
    const gridDeltaY = deltaY / (rowHeight + verticalMargin2);
    const deltaW = Math.round(gridDeltaX + (gridDeltaX > 0 ? -threshold : threshold));
    const deltaH = Math.round(gridDeltaY + (gridDeltaY > 0 ? -threshold : threshold));
    let newW = resizeState.startSize.w;
    let newH = resizeState.startSize.h;
    let newX = item.x;
    let newY = item.y;
    const originalX = resizeState.originalPos?.x || item.x;
    const originalY = resizeState.originalPos?.y || item.y;
    switch (resizeState.resizeHandle) {
      case "se":
        newW = resizeState.startSize.w + deltaW;
        newH = resizeState.startSize.h + deltaH;
        break;
      case "sw":
        newW = resizeState.startSize.w - deltaW;
        newH = resizeState.startSize.h + deltaH;
        newX = originalX + deltaW;
        break;
      case "ne":
        newW = resizeState.startSize.w + deltaW;
        newH = resizeState.startSize.h - deltaH;
        newY = originalY + deltaH;
        break;
      case "nw":
        newW = resizeState.startSize.w - deltaW;
        newH = resizeState.startSize.h - deltaH;
        newX = originalX + deltaW;
        newY = originalY + deltaH;
        break;
      case "e":
        newW = resizeState.startSize.w + deltaW;
        break;
      case "w":
        newW = resizeState.startSize.w - deltaW;
        newX = originalX + deltaW;
        break;
      case "s":
        newH = resizeState.startSize.h + deltaH;
        break;
      case "n":
        newH = resizeState.startSize.h - deltaH;
        newY = originalY + deltaH;
        break;
    }
    newW = Math.max(item.minW || 1, newW);
    newH = Math.max(item.minH || 1, newH);
    if (item.maxW) newW = Math.min(newW, item.maxW);
    if (item.maxH) newH = Math.min(newH, item.maxH);
    newX = Math.max(0, newX);
    newY = Math.max(0, newY);
    newW = Math.min(newW, cols - newX);
    const newLayout = layout.map(
      (i) => i.id === resizeState.resizedItem ? { ...i, x: newX, y: newY, w: newW, h: newH } : i
    );
    setLayout(newLayout);
    if (onResize && resizeState.originalPos) {
      const element = containerRef.current?.querySelector(`[data-grid-id="${resizeState.resizedItem}"]`);
      if (element) {
        const originalItem = { ...item, x: resizeState.originalPos.x, y: resizeState.originalPos.y, w: resizeState.startSize.w, h: resizeState.startSize.h };
        const newItem = { ...item, x: newX, y: newY, w: newW, h: newH };
        onResize(newLayout, originalItem, newItem, newItem, e, element);
      }
    }
  }, [resizeState, layout, containerWidth, cols, rowHeight, gap, margin, onResize]);
  const handleResizeEnd = reactExports.useCallback((e) => {
    const resizedItem = layout.find((i) => i.id === resizeState.resizedItem);
    if (resizedItem && onResizeStop && resizeState.originalPos) {
      const element = containerRef.current?.querySelector(`[data-grid-id="${resizeState.resizedItem}"]`);
      if (element) {
        const originalItem = { ...resizedItem, x: resizeState.originalPos.x, y: resizeState.originalPos.y, w: resizeState.startSize.w, h: resizeState.startSize.h };
        onResizeStop(layout, originalItem, resizedItem, resizedItem, e, element);
      }
    }
    updateLayout(layout);
    setResizeState({
      isResizing: false,
      resizedItem: null,
      resizeHandle: null,
      startSize: { w: 0, h: 0 },
      startPos: { x: 0, y: 0 }
    });
  }, [resizeState, layout, updateLayout, onResizeStop]);
  reactExports.useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
      return () => {
        document.removeEventListener("mousemove", handleDragMove);
        document.removeEventListener("mouseup", handleDragEnd);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
    return void 0;
  }, [dragState.isDragging, handleDragMove, handleDragEnd]);
  reactExports.useEffect(() => {
    if (resizeState.isResizing) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
      document.body.style.userSelect = "none";
      return () => {
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeEnd);
        document.body.style.userSelect = "";
      };
    }
    return void 0;
  }, [resizeState.isResizing, handleResizeMove, handleResizeEnd]);
  const verticalMargin = margin ? margin[1] : gap;
  const heights = layout.map((item) => (item.y + item.h) * (rowHeight + verticalMargin));
  const calculatedHeight = heights.length > 0 ? Math.max(...heights) : 0;
  const gridHeight = autoSize ? calculatedHeight : void 0;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      ref: containerRef,
      className: cn(
        "relative w-full overflow-auto",
        dragState.isDragging && "select-none",
        className
      ),
      style: {
        ...gridHeight !== void 0 && { minHeight: gridHeight + containerPadding[1] * 2 },
        padding: `${containerPadding[1]}px ${containerPadding[0]}px`,
        ...style
      },
      children: [
        layout.map((item) => {
          const isDragging = dragState.draggedItem === item.id;
          let position = getPixelPosition(item, cols, rowHeight, gap, containerWidth, margin);
          if (isDragging && dragState.currentMousePos && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            position = {
              ...position,
              left: dragState.currentMousePos.x - containerRect.left - dragState.dragOffset.x - containerPadding[0],
              top: dragState.currentMousePos.y - containerRect.top - dragState.dragOffset.y - containerPadding[1]
            };
          }
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            GridItemComponent,
            {
              item,
              position,
              isDragging,
              isResizing: resizeState.resizedItem === item.id,
              isDraggable: isDraggable && item.isDraggable !== false,
              isResizable: isResizable && item.isResizable !== false,
              resizeHandles,
              draggableCancel,
              onDragStart: handleDragStart,
              onResizeStart: handleResizeStart,
              children: children(item)
            },
            item.id,
            false,
            {
              fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/GridContainer.tsx",
              lineNumber: 469,
              columnNumber: 11
            },
            undefined
          );
        }),
        dragState.isDragging && dragState.placeholder && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "absolute rounded-lg transition-all duration-300 pointer-events-none",
            style: {
              ...getPixelPosition(dragState.placeholder, cols, rowHeight, gap, containerWidth, margin),
              zIndex: 9,
              background: "rgba(59, 130, 246, 0.15)",
              border: "2px dashed rgb(59, 130, 246)",
              boxSizing: "border-box"
            }
          },
          void 0,
          false,
          {
            fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/GridContainer.tsx",
            lineNumber: 489,
            columnNumber: 9
          },
          undefined
        ),
        resizeState.isResizing && resizeState.resizedItem && (() => {
          const resizedItem = layout.find((i) => i.id === resizeState.resizedItem);
          if (!resizedItem) return null;
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "div",
            {
              className: "absolute rounded-lg transition-all duration-200 pointer-events-none",
              style: {
                ...getPixelPosition(resizedItem, cols, rowHeight, gap, containerWidth, margin),
                zIndex: 8,
                background: "rgba(59, 130, 246, 0.1)",
                border: "2px dashed rgb(59, 130, 246)",
                boxSizing: "border-box"
              }
            },
            void 0,
            false,
            {
              fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/GridContainer.tsx",
              lineNumber: 507,
              columnNumber: 11
            },
            undefined
          );
        })(),
        droppingItem && !dragState.isDragging && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "absolute bg-gray-200 border-2 border-dashed border-gray-400 rounded opacity-75 pointer-events-none flex items-center justify-center",
            style: {
              width: (droppingItem.w || 1) * containerWidth / cols - gap,
              height: (droppingItem.h || 1) * rowHeight - gap,
              left: containerPadding[0],
              top: containerPadding[1]
            },
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-gray-600 font-medium", children: "Drop here" }, void 0, false, {
              fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/GridContainer.tsx",
              lineNumber: 531,
              columnNumber: 11
            }, undefined)
          },
          void 0,
          false,
          {
            fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/GridContainer.tsx",
            lineNumber: 522,
            columnNumber: 9
          },
          undefined
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/GridContainer.tsx",
      lineNumber: 440,
      columnNumber: 5
    },
    undefined
  );
};

export { GridContainer };
//# sourceMappingURL=GridContainer-DPBnAhhn.js.map
