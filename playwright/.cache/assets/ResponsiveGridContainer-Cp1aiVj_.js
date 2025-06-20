import { j as jsxDevRuntimeExports } from './jsx-dev-runtime-BOfTfjLc.js';
import { r as reactExports } from './index-BjJjVscZ.js';
import { GridContainer } from './GridContainer-DPBnAhhn.js';
import './ResizeHandle-DnYSTVAO.js';
import './GridItem-DXm8-s75.js';

const defaultBreakpoints = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0
};
const defaultCols = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2
};
function ResponsiveGridContainer({
  layouts,
  breakpoints = defaultBreakpoints,
  cols = defaultCols,
  onLayoutChange,
  onBreakpointChange,
  width,
  ...props
}) {
  const [currentBreakpoint, setCurrentBreakpoint] = reactExports.useState("lg");
  const [currentCols, setCurrentCols] = reactExports.useState(
    typeof cols === "object" && cols.lg ? cols.lg : 12
  );
  const sortedBreakpoints = reactExports.useMemo(() => {
    return Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
  }, [breakpoints]);
  const getBreakpoint = (width2) => {
    if (sortedBreakpoints.length === 0) return "lg";
    const lastEntry = sortedBreakpoints[sortedBreakpoints.length - 1];
    let breakpoint = lastEntry[0];
    for (const [bp, minWidth] of sortedBreakpoints) {
      if (width2 >= minWidth) {
        breakpoint = bp;
        break;
      }
    }
    return breakpoint;
  };
  reactExports.useEffect(() => {
    const handleResize = () => {
      const containerWidth = width ?? window.innerWidth;
      const newBreakpoint = getBreakpoint(containerWidth);
      if (newBreakpoint !== currentBreakpoint) {
        setCurrentBreakpoint(newBreakpoint);
        const newCols = typeof cols === "object" && cols[newBreakpoint] || defaultCols[newBreakpoint] || 12;
        setCurrentCols(newCols);
        onBreakpointChange?.(newBreakpoint, newCols);
      }
    };
    handleResize();
    if (width === void 0) {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
    return void 0;
  }, [currentBreakpoint, cols, sortedBreakpoints, onBreakpointChange, width]);
  const currentLayout = layouts[currentBreakpoint] || [];
  const handleLayoutChange = (newLayout) => {
    const newLayouts = {
      ...layouts,
      [currentBreakpoint]: newLayout
    };
    onLayoutChange?.(newLayout, newLayouts);
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    GridContainer,
    {
      ...props,
      items: currentLayout,
      cols: currentCols,
      onLayoutChange: handleLayoutChange
    },
    void 0,
    false,
    {
      fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/ResponsiveGridContainer.tsx",
      lineNumber: 110,
      columnNumber: 5
    },
    this
  );
}

export { ResponsiveGridContainer };
//# sourceMappingURL=ResponsiveGridContainer-Cp1aiVj_.js.map
