#!/usr/bin/env node

/**
 * Clean Duplicate act() Wrapping Script
 * 
 * This script removes duplicate act() wrapping that may have been created
 * by the automatic fix script.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = resolve(__dirname, '..')
const testsDir = resolve(projectRoot, 'src/components/__tests__')

console.log('🧹 Cleaning duplicate act() wrapping...')

// Get all test files
const testFiles = readdirSync(testsDir)
  .filter(file => file.endsWith('.test.tsx') || file.endsWith('.test.ts'))
  .map(file => resolve(testsDir, file))

console.log(`📁 Found ${testFiles.length} test files to clean`)

let totalCleaned = 0

testFiles.forEach(filePath => {
  console.log(`\n🔍 Processing: ${filePath.split('/').pop()}`)
  
  let content = readFileSync(filePath, 'utf8')
  let cleaned = 0
  
  // Remove nested act() calls like:
  // act(() => {
  //   act(() => {
  //     fireEvent.mouseDown(...)
  //   })
  // })
  content = content.replace(
    /act\(\(\) => \{\s*act\(\(\) => \{\s*(.*?)\s*\}\)\s*\}\)/gs,
    (match, innerContent) => {
      console.log('  🔧 Removed nested act() wrapping')
      cleaned++
      return `act(() => {\n      ${innerContent.trim()}\n    })`
    }
  )
  
  // Remove triple nested act() calls
  content = content.replace(
    /act\(\(\) => \{\s*act\(\(\) => \{\s*act\(\(\) => \{\s*(.*?)\s*\}\)\s*\}\)\s*\}\)/gs,
    (match, innerContent) => {
      console.log('  🔧 Removed triple nested act() wrapping')
      cleaned++
      return `act(() => {\n        ${innerContent.trim()}\n      })`
    }
  )
  
  // Fix indentation issues
  content = content.replace(
    /act\(\(\) => \{\s*\n\s*act\(\(\) => \{\s*\n\s*(.*?)\s*\n\s*\}\)\s*\n\s*\}\)/gs,
    (match, innerContent) => {
      console.log('  📝 Fixed indentation in nested act()')
      cleaned++
      return `act(() => {\n      ${innerContent.trim()}\n    })`
    }
  )
  
  // Remove empty act() calls
  content = content.replace(
    /act\(\(\) => \{\s*\}\)/g,
    () => {
      console.log('  🗑️  Removed empty act() call')
      cleaned++
      return ''
    }
  )
  
  if (cleaned > 0) {
    writeFileSync(filePath, content, 'utf8')
    console.log(`  ✅ Cleaned ${cleaned} duplicate act() issues`)
    totalCleaned += cleaned
  } else {
    console.log('  ℹ️  No duplicate act() issues found')
  }
})

console.log(`\n🎯 Summary:`)
console.log(`📁 Processed ${testFiles.length} test files`)
console.log(`🧹 Cleaned ${totalCleaned} duplicate act() issues`)
console.log('✅ All duplicate act() wrapping cleaned!')

console.log('\n🧪 Next step: Run tests to verify')
console.log('pnpm test 2>&1 | grep -c "act" || echo "No act warnings found"')