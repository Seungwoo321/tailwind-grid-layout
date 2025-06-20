import { j as jsxDevRuntimeExports } from './jsx-dev-runtime-BOfTfjLc.js';
import { R as React } from './index-BjJjVscZ.js';
import { WidthProvider } from './WidthProvider-DHmOV0Kd.js';

const WidthProviderTestComponent = ({ show }) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: show && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(WidthProvider, { children: (width) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { "data-testid": "width-display", children: [
  "Width: ",
  width ?? "calculating..."
] }, void 0, true, {
  fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/e2e/test-components.tsx",
  lineNumber: 13,
  columnNumber: 11
}, undefined) }, void 0, false, {
  fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/e2e/test-components.tsx",
  lineNumber: 11,
  columnNumber: 7
}, undefined) }, void 0, false, {
  fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/e2e/test-components.tsx",
  lineNumber: 9,
  columnNumber: 3
}, undefined);
const WidthProviderContentToggle = () => {
  const [showContent, setShowContent] = React.useState(true);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(WidthProvider, { children: (width) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setShowContent(false), children: "Null" }, void 0, false, {
      fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/e2e/test-components.tsx",
      lineNumber: 29,
      columnNumber: 11
    }, undefined),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setShowContent(true), children: "Content" }, void 0, false, {
      fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/e2e/test-components.tsx",
      lineNumber: 32,
      columnNumber: 11
    }, undefined),
    showContent ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { "data-testid": "content", children: [
      "Width: ",
      width
    ] }, void 0, true, {
      fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/e2e/test-components.tsx",
      lineNumber: 36,
      columnNumber: 13
    }, undefined) : null
  ] }, void 0, true, {
    fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/e2e/test-components.tsx",
    lineNumber: 28,
    columnNumber: 9
  }, undefined) }, void 0, false, {
    fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/e2e/test-components.tsx",
    lineNumber: 26,
    columnNumber: 5
  }, undefined);
};
const WidthProviderNullObserver = () => {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(WidthProvider, { children: (width) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { "data-testid": "width", children: width }, void 0, false, {
    fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/e2e/test-components.tsx",
    lineNumber: 47,
    columnNumber: 19
  }, undefined) }, void 0, false, {
    fileName: "/Users/mzc01-swlee/.claude-squad/worktrees/test-coverage_184a0a28fdbe9410/e2e/test-components.tsx",
    lineNumber: 46,
    columnNumber: 5
  }, undefined);
};

export { WidthProviderContentToggle, WidthProviderNullObserver, WidthProviderTestComponent };
//# sourceMappingURL=test-components-BWxLUFPQ.js.map
