import React, { useState, useRef } from 'react'
import { GridContainer } from 'tailwind-grid-layout'
import type { GridItem } from 'tailwind-grid-layout'

// Copy to clipboard helper
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// Simple syntax highlighter for TSX/JSX
function highlightCode(code: string, language: string): React.ReactNode[] {
  if (language === 'bash') {
    return [<span key="bash" className="text-emerald-400">{code}</span>]
  }

  const lines = code.split('\n')
  return lines.map((line, lineIndex) => {
    const parts: React.ReactNode[] = []
    let partIndex = 0

    // Keywords
    const keywords = ['import', 'export', 'default', 'function', 'const', 'return', 'from']
    // Types/Components (capitalized words)
    const componentRegex = /\b([A-Z][a-zA-Z]*)\b/g
    // Strings
    const stringRegex = /(['"`])(?:(?!\1)[^\\]|\\.)*\1/g
    // Numbers
    const numberRegex = /\b(\d+)\b/g

    // Process line character by character with regex matches
    const tokens: { start: number; end: number; type: string; text: string }[] = []

    // Find strings
    let match
    while ((match = stringRegex.exec(line)) !== null) {
      tokens.push({ start: match.index, end: match.index + match[0].length, type: 'string', text: match[0] })
    }

    // Find keywords
    keywords.forEach(kw => {
      const kwRegex = new RegExp(`\\b(${kw})\\b`, 'g')
      while ((match = kwRegex.exec(line)) !== null) {
        if (!tokens.some(t => match!.index >= t.start && match!.index < t.end)) {
          tokens.push({ start: match.index, end: match.index + match[0].length, type: 'keyword', text: match[0] })
        }
      }
    })

    // Find components
    while ((match = componentRegex.exec(line)) !== null) {
      if (!tokens.some(t => match!.index >= t.start && match!.index < t.end)) {
        tokens.push({ start: match.index, end: match.index + match[0].length, type: 'component', text: match[0] })
      }
    }

    // Find numbers
    while ((match = numberRegex.exec(line)) !== null) {
      if (!tokens.some(t => match!.index >= t.start && match!.index < t.end)) {
        tokens.push({ start: match.index, end: match.index + match[0].length, type: 'number', text: match[0] })
      }
    }

    // Sort tokens by position
    tokens.sort((a, b) => a.start - b.start)

    // Build highlighted line
    let pos = 0
    tokens.forEach((token) => {
      if (token.start > pos) {
        parts.push(<span key={`${lineIndex}-${partIndex++}`} className="text-slate-300">{line.slice(pos, token.start)}</span>)
      }
      const colorClass = {
        keyword: 'text-purple-400',
        string: 'text-emerald-400',
        component: 'text-sky-400',
        number: 'text-amber-400',
      }[token.type] || 'text-slate-300'
      parts.push(<span key={`${lineIndex}-${partIndex++}`} className={colorClass}>{token.text}</span>)
      pos = token.end
    })
    if (pos < line.length) {
      parts.push(<span key={`${lineIndex}-${partIndex++}`} className="text-slate-300">{line.slice(pos)}</span>)
    }

    return (
      <React.Fragment key={lineIndex}>
        {parts}
        {lineIndex < lines.length - 1 && '\n'}
      </React.Fragment>
    )
  })
}

// Code Block Component
function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(code)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative group">
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
        <code>{highlightCode(code, language)}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all">
      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 text-slate-700">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

export function ShowcaseExample() {
  const demoRef = useRef<HTMLDivElement>(null)

  const [demoItems, setDemoItems] = useState<GridItem[]>([
    { id: 'revenue', x: 0, y: 0, w: 3, h: 2 },
    { id: 'chart', x: 3, y: 0, w: 5, h: 3 },
    { id: 'users', x: 8, y: 0, w: 4, h: 2 },
    { id: 'activity', x: 0, y: 2, w: 3, h: 2 },
    { id: 'timeline', x: 8, y: 2, w: 4, h: 2 },
  ])

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const widgetContent: Record<string, { label: string; value: string; icon: React.ReactNode }> = {
    revenue: {
      label: 'Revenue',
      value: '$45,231',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    chart: {
      label: 'Analytics',
      value: 'Overview',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
    users: {
      label: 'Users',
      value: '2,350',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    },
    activity: {
      label: 'Activity',
      value: '89%',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
    },
    timeline: {
      label: 'Timeline',
      value: 'Events',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiAwaC0ydjRoMnYtNHptMCA2aC0ydjRoMnYtNHoiIGZpbGw9IiMzMzQxNTUiIGZpbGwtb3BhY2l0eT0iLjMiLz48L2c+PC9zdmc+')] opacity-40" />

        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="text-white font-semibold text-xl">Tailwind Grid Layout</div>
          <div className="flex items-center gap-4">
            <a href="https://www.npmjs.com/package/tailwind-grid-layout" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors text-sm">npm</a>
            <a href="https://seungwoo321.github.io/tailwind-grid-layout/storybook" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors text-sm">Storybook</a>
            <a href="https://github.com/Seungwoo321/tailwind-grid-layout" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors" aria-label="GitHub">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.02 10.02 0 0022 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          </div>
        </nav>

        <div className="relative z-10 px-6 pt-16 pb-24 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Modern Grid Layout<br />
              <span className="text-slate-400">for React + Tailwind</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              A lightweight, Tailwind-native alternative to react-grid-layout.
              Drag, resize, and organize content with full touch support.
            </p>
            <div className="max-w-md mx-auto mb-8">
              <CodeBlock code="npm install tailwind-grid-layout" />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={scrollToDemo} className="px-6 py-3 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors">Try Demo</button>
              <a href="https://github.com/Seungwoo321/tailwind-grid-layout" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.02 10.02 0 0022 12c0-5.523-4.477-10-10-10z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Tailwind Grid Layout?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Built for modern React applications with Tailwind CSS at its core.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>} title="Tailwind Native" description="No external CSS. Built entirely with Tailwind utilities for seamless integration with your existing styles." />
            <FeatureCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} title="50% Smaller Bundle" description="Lightweight alternative to react-grid-layout with the same functionality at half the size." />
            <FeatureCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>} title="Touch Support" description="Full touch event support for mobile. Drag and resize with natural gestures." />
            <FeatureCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>} title="Responsive Breakpoints" description="Define different layouts for each breakpoint. Grids adapt automatically to screen size." />
            <FeatureCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} title="TypeScript Ready" description="Full TypeScript support with comprehensive type definitions for excellent DX." />
            <FeatureCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} title="API Compatible" description="Drop-in replacement for react-grid-layout. Migrate with minimal changes." />
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section ref={demoRef} className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Try It Out</h2>
            <p className="text-slate-600">Drag and resize the widgets below</p>
          </div>
          <div className="bg-slate-100 rounded-xl p-4 md:p-6">
            <GridContainer items={demoItems} cols={12} rowHeight={80} gap={16} onLayoutChange={setDemoItems} resizeHandles={['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w']} preserveInitialHeight autoSize={false}>
              {(item) => {
                const content = widgetContent[item.id] || { label: item.id, value: '', icon: null }
                return (
                  <div className="h-full bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-500">{content.label}</span>
                      <span className="text-slate-400">{content.icon}</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{content.value}</div>
                      <div className="text-xs text-slate-400 mt-1">{item.w}×{item.h} grid</div>
                    </div>
                  </div>
                )
              }}
            </GridContainer>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Quick Start</h2>
            <p className="text-slate-600">Get started in under a minute</p>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">1. Install</h3>
              <CodeBlock code="npm install tailwind-grid-layout" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">2. Import and Use</h3>
              <CodeBlock language="tsx" code={`import { useState } from 'react'
import { GridContainer } from 'tailwind-grid-layout'
import type { GridItem } from 'tailwind-grid-layout'

const initialItems: GridItem[] = [
  { id: 'revenue', x: 0, y: 0, w: 3, h: 2 },
  { id: 'chart', x: 3, y: 0, w: 5, h: 3 },
  { id: 'users', x: 8, y: 0, w: 4, h: 2 },
]

export default function Dashboard() {
  const [items, setItems] = useState(initialItems)

  return (
    <GridContainer
      items={items}
      cols={12}
      rowHeight={80}
      gap={16}
      onLayoutChange={setItems}
    >
      {(item) => (
        <div className="h-full bg-white rounded-xl p-4 shadow-sm">
          {item.id}
        </div>
      )}
    </GridContainer>
  )
}`} />
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Comparison</h2>
            <p className="text-slate-600">How we stack up against react-grid-layout</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-4 text-slate-600 font-medium">Feature</th>
                  <th className="text-center py-4 px-4 text-slate-600 font-medium">tailwind-grid-layout</th>
                  <th className="text-center py-4 px-4 text-slate-600 font-medium">react-grid-layout</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100"><td className="py-4 px-4 text-slate-900">Bundle Size</td><td className="py-4 px-4 text-center text-green-600 font-medium">~15KB</td><td className="py-4 px-4 text-center text-slate-600">~30KB</td></tr>
                <tr className="border-b border-slate-100"><td className="py-4 px-4 text-slate-900">Tailwind Native</td><td className="py-4 px-4 text-center text-green-600">✓</td><td className="py-4 px-4 text-center text-slate-400">✗</td></tr>
                <tr className="border-b border-slate-100"><td className="py-4 px-4 text-slate-900">TypeScript</td><td className="py-4 px-4 text-center text-green-600">✓</td><td className="py-4 px-4 text-center text-green-600">✓</td></tr>
                <tr className="border-b border-slate-100"><td className="py-4 px-4 text-slate-900">Touch Support</td><td className="py-4 px-4 text-center text-green-600">✓</td><td className="py-4 px-4 text-center text-green-600">✓</td></tr>
                <tr className="border-b border-slate-100"><td className="py-4 px-4 text-slate-900">Responsive</td><td className="py-4 px-4 text-center text-green-600">✓</td><td className="py-4 px-4 text-center text-green-600">✓</td></tr>
                <tr><td className="py-4 px-4 text-slate-900">External CSS Required</td><td className="py-4 px-4 text-center text-green-600">No</td><td className="py-4 px-4 text-center text-slate-600">Yes</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="font-semibold text-lg mb-1">Tailwind Grid Layout</div>
              <p className="text-slate-400 text-sm">MIT License</p>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://github.com/Seungwoo321/tailwind-grid-layout" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm">GitHub</a>
              <a href="https://www.npmjs.com/package/tailwind-grid-layout" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm">npm</a>
              <a href="https://seungwoo321.github.io/tailwind-grid-layout/storybook" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm">Storybook</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            Made by <a href="https://github.com/Seungwoo321" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">@Seungwoo321</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
