#!/bin/bash

# Floating Document Panel Setup Script
echo "Installing dependencies for the Floating Document Panel solution..."

# Determine package manager
if [ -f "yarn.lock" ]; then
  echo "Using yarn to install dependencies..."
  yarn add sonner marked dompurify
elif [ -f "pnpm-lock.yaml" ]; then
  echo "Using pnpm to install dependencies..."
  pnpm add sonner marked dompurify
else
  echo "Using npm to install dependencies..."
  npm install sonner marked dompurify
fi

# Check if types are needed
echo "Installing type definitions..."
npm list @types/marked > /dev/null 2>&1
if [ $? -ne 0 ]; then
  if [ -f "yarn.lock" ]; then
    yarn add -D @types/marked @types/dompurify
  elif [ -f "pnpm-lock.yaml" ]; then
    pnpm add -D @types/marked @types/dompurify
  else
    npm install -D @types/marked @types/dompurify
  fi
fi

echo "Dependencies installed successfully!"
echo "To use the Floating Document Panel, follow the integration guide in ProjectGeneratorIntegration.md" 