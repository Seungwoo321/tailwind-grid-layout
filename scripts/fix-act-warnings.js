#!/usr/bin/env node

/**
 * Fix React act() Warnings Script
 * 
 * This script automatically fixes React act() warnings by:
 * 1. Adding act import to test files
 * 2. Wrapping fireEvent calls with act()
 * 3. Wrapping document.dispatchEvent calls with act()
 * 4. Wrapping setTimeout operations that cause state updates with act()
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = resolve(__dirname, '..')
const testsDir = resolve(projectRoot, 'src/components/__tests__')

console.log('🔧 Starting React act() warnings fix...')

// Get all test files
const testFiles = readdirSync(testsDir)
  .filter(file => file.endsWith('.test.tsx') || file.endsWith('.test.ts'))
  .map(file => resolve(testsDir, file))

console.log(`📁 Found ${testFiles.length} test files to process`)

let totalFixed = 0

testFiles.forEach(filePath => {
  console.log(`\n📝 Processing: ${filePath.split('/').pop()}`)
  
  let content = readFileSync(filePath, 'utf8')
  let modified = false
  let fixCount = 0
  
  // 1. Add act import if missing and fireEvent exists
  if (content.includes('fireEvent') && !content.includes(', act')) {
    content = content.replace(
      /import \{ ([^}]*fireEvent[^}]*) \} from '@testing-library\/react'/,
      'import { $1, act } from \'@testing-library/react\''
    )
    console.log('  ✅ Added act import')
    modified = true
    fixCount++
  }
  
  // 2. Wrap fireEvent.mouseDown calls
  content = content.replace(
    /^(\s*)(fireEvent\.mouseDown\([^)]+\))$/gm,
    (match, indent, fireEventCall) => {
      if (match.includes('act(')) return match // Already wrapped
      console.log('  🖱️  Fixed fireEvent.mouseDown')
      fixCount++
      return `${indent}act(() => {\n${indent}  ${fireEventCall}\n${indent}})`
    }
  )
  
  // 3. Wrap fireEvent.mouseMove calls
  content = content.replace(
    /^(\s*)(fireEvent\.mouseMove\([^)]+\))$/gm,
    (match, indent, fireEventCall) => {
      if (match.includes('act(')) return match
      console.log('  🖱️  Fixed fireEvent.mouseMove')
      fixCount++
      return `${indent}act(() => {\n${indent}  ${fireEventCall}\n${indent}})`
    }
  )
  
  // 4. Wrap fireEvent.mouseUp calls
  content = content.replace(
    /^(\s*)(fireEvent\.mouseUp\([^)]+\))$/gm,
    (match, indent, fireEventCall) => {
      if (match.includes('act(')) return match
      console.log('  🖱️  Fixed fireEvent.mouseUp')
      fixCount++
      return `${indent}act(() => {\n${indent}  ${fireEventCall}\n${indent}})`
    }
  )
  
  // 5. Wrap document.dispatchEvent calls
  content = content.replace(
    /^(\s*)(document\.dispatchEvent\([^)]+\))$/gm,
    (match, indent, dispatchCall) => {
      if (match.includes('act(')) return match
      console.log('  📡 Fixed document.dispatchEvent')
      fixCount++
      return `${indent}act(() => {\n${indent}  ${dispatchCall}\n${indent}})`
    }
  )
  
  // 6. Wrap element.dispatchEvent calls
  content = content.replace(
    /^(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*\.dispatchEvent\([^)]+\))$/gm,
    (match, indent, dispatchCall) => {
      if (match.includes('act(') || match.includes('container.dispatchEvent')) return match
      console.log('  📡 Fixed element.dispatchEvent')
      fixCount++
      return `${indent}act(() => {\n${indent}  ${dispatchCall}\n${indent}})`
    }
  )
  
  // 7. Fix setTimeout with fireEvent inside (more complex pattern)
  content = content.replace(
    /(setTimeout\(\(\) => \{[\s\S]*?fireEvent[\s\S]*?\}, \d+\))/gm,
    (match) => {
      if (match.includes('act(')) return match
      console.log('  ⏰ Fixed setTimeout with fireEvent')
      fixCount++
      return `act(() => {\n        ${match}\n      })`
    }
  )
  
  if (fixCount > 0) {
    writeFileSync(filePath, content, 'utf8')
    console.log(`  ✅ Fixed ${fixCount} act() issues`)
    totalFixed += fixCount
    modified = true
  } else {
    console.log('  ℹ️  No act() issues found')
  }
})

console.log(`\n🎯 Summary:`)
console.log(`📁 Processed ${testFiles.length} test files`)
console.log(`🔧 Fixed ${totalFixed} act() warnings`)
console.log('✅ All React act() warnings should now be resolved!')

console.log('\n🧪 Next steps:')
console.log('1. Run tests to verify fixes: pnpm test')
console.log('2. Check for remaining warnings: pnpm test 2>&1 | grep "act"')
console.log('3. Run coverage: pnpm test:coverage')