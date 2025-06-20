import { j as jsxDevRuntimeExports } from './jsx-dev-runtime-BOfTfjLc.js';
import { r as reactExports } from './index-BjJjVscZ.js';

function WidthProvider(Component) {
  return function WidthProviderComponent(props) {
    const { measureBeforeMount = false, ...rest } = props;
    const [width, setWidth] = reactExports.useState(
      measureBeforeMount ? void 0 : 1280
    );
    const elementRef = reactExports.useRef(null);
    const mounted = reactExports.useRef(false);
    reactExports.useEffect(() => {
      mounted.current = true;
      const handleResize = () => {
        const element = elementRef.current;
        if (!element) return;
        const newWidth = element.offsetWidth;
        setWidth(newWidth);
      };
      if (!measureBeforeMount) {
        handleResize();
      }
      let resizeObserver = null;
      if (elementRef.current && "ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(elementRef.current);
      } else {
        window.addEventListener("resize", handleResize);
      }
      return () => {
        mounted.current = false;
        if (resizeObserver) {
          resizeObserver.disconnect();
        } else {
          window.removeEventListener("resize", handleResize);
        }
      };
    }, [measureBeforeMount]);
    if (measureBeforeMount && width === void 0) {
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { ref: elementRef, style: { width: "100%" } }, void 0, false, {
        fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/WidthProvider.tsx",
        lineNumber: 57,
        columnNumber: 14
      }, this);
    }
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { ref: elementRef, style: { width: "100%" }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Component, { ...rest, width }, void 0, false, {
      fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/WidthProvider.tsx",
      lineNumber: 62,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/src/components/WidthProvider.tsx",
      lineNumber: 61,
      columnNumber: 7
    }, this);
  };
}

export { WidthProvider };
//# sourceMappingURL=WidthProvider-DHmOV0Kd.js.map
