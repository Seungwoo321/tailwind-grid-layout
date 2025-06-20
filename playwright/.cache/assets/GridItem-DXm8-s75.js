import { j as jsxDevRuntimeExports } from './jsx-dev-runtime-BOfTfjLc.js';
import { R as ResizeHandle, c as cn } from './ResizeHandle-DnYSTVAO.js';
import './index-BjJjVscZ.js';

"use client";
const GridItemComponent = ({
  item,
  position,
  isDragging,
  isResizing,
  isDraggable,
  isResizable,
  resizeHandles = ["se"],
  draggableCancel,
  onDragStart,
  onResizeStart,
  children
}) => {
  const handleMouseDown = (e) => {
    if (item.static) return;
    const target = e.target;
    const isDragHandle = target.closest(".grid-drag-handle");
    const isActionButton = target.closest(".grid-actions, button, a");
    const isCancelled = draggableCancel && target.closest(draggableCancel);
    if (isDraggable && !e.defaultPrevented && (isDragHandle || !target.closest(".grid-drag-handle")) && !isActionButton && !isCancelled) {
      onDragStart(item.id, e);
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      "data-grid-id": item.id,
      className: cn(
        "absolute",
        !isDragging && "transition-all duration-200",
        isDragging && "opacity-80 z-50 cursor-grabbing shadow-2xl",
        isResizing && "z-40",
        !isDragging && !isResizing && "hover:z-30",
        item.static && "cursor-not-allowed",
        item.className
      ),
      style: {
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
        transform: isDragging ? "scale(1.02)" : "scale(1)",
        cursor: isDraggable ? "grab" : "default"
      },
      onMouseDown: handleMouseDown,
      children: [
        children,
        isResizable && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: resizeHandles.map((handle) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          ResizeHandle,
          {
            position: handle,
            onMouseDown: (e) => onResizeStart(item.id, handle, e),
            isActive: true,
            isVisible: ["se", "sw", "ne", "nw"].includes(handle)
          },
          handle,
          false,
          {
            fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/GridItem.tsx",
            lineNumber: 80,
            columnNumber: 13
          },
          undefined
        )) }, void 0, false, {
          fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/GridItem.tsx",
          lineNumber: 78,
          columnNumber: 9
        }, undefined)
      ]
    },
    void 0,
    true,
    {
      fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/GridItem.tsx",
      lineNumber: 53,
      columnNumber: 5
    },
    undefined
  );
};

export { GridItemComponent };
//# sourceMappingURL=GridItem-DXm8-s75.js.map
