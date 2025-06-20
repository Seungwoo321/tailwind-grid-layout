import { j as jsxDevRuntimeExports } from './jsx-dev-runtime-BOfTfjLc.js';
import { r as reactExports } from './index-BjJjVscZ.js';
import { GridContainer } from './GridContainer-DPBnAhhn.js';
import { c as cn } from './ResizeHandle-DnYSTVAO.js';
import './GridItem-DXm8-s75.js';

function DroppableGridContainer({
  onDrop,
  droppingItem = { w: 2, h: 2 },
  className,
  ...props
}) {
  const [isDraggingOver, setIsDraggingOver] = reactExports.useState(false);
  const containerRef = reactExports.useRef(null);
  const handleDragOver = (e) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
    setIsDraggingOver(true);
  };
  const handleDragLeave = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      const isOutsideBounds = clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom;
      if (isOutsideBounds) {
        setIsDraggingOver(false);
      }
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    try {
      const droppedData = JSON.parse(data);
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      const cols = props.cols || 12;
      const rowHeight = props.rowHeight || 60;
      const gap = props.gap || 16;
      const cellWidth = rect.width / cols;
      const cellHeight = rowHeight + gap;
      const gridX = Math.floor(relativeX / cellWidth);
      const gridY = Math.floor(relativeY / cellHeight);
      const newItem = {
        id: droppedData.id || `dropped-${Date.now()}`,
        x: Math.max(0, Math.min(gridX, cols - (droppingItem.w || 2))),
        y: Math.max(0, gridY),
        w: droppingItem.w || 2,
        h: droppingItem.h || 2,
        ...droppedData
      };
      onDrop?.(newItem);
    } catch (error) {
      console.error("Failed to parse dropped data:", error);
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      ref: containerRef,
      className: cn(
        "relative",
        isDraggingOver && "ring-2 ring-blue-500 ring-offset-2 rounded-lg",
        className
      ),
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(GridContainer, { ...props, droppingItem: isDraggingOver ? droppingItem : void 0 }, void 0, false, {
          fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/DroppableGridContainer.tsx",
          lineNumber: 98,
          columnNumber: 7
        }, this),
        isDraggingOver && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "absolute inset-0 bg-blue-500/10 rounded-lg pointer-events-none" }, void 0, false, {
          fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/DroppableGridContainer.tsx",
          lineNumber: 100,
          columnNumber: 9
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/DroppableGridContainer.tsx",
      lineNumber: 87,
      columnNumber: 5
    },
    this
  );
}

export { DroppableGridContainer };
//# sourceMappingURL=DroppableGridContainer-BY57MmqI.js.map
