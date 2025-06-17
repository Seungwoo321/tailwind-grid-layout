#!/bin/bash
# TypeScript type checking script

echo "Running TypeScript type check..."
npx tsc --noEmit

echo "Running TypeScript build check..."
npx tsc -p tsconfig.build.json --noEmit

echo "Type checking complete!"