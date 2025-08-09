#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const shadcnDir = path.join(__dirname, '../src/components/ui/shadcn');

// Read all .tsx files in shadcn directory
const files = fs.readdirSync(shadcnDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(shadcnDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace imports from @/components/ui/* to @/components/ui/shadcn/*
  const patterns = [
    'button',
    'dialog',
    'label',
    'input',
    'separator',
    'sheet',
    'skeleton',
    'tooltip'
  ];
  
  for (const pattern of patterns) {
    // Replace both single quotes and double quotes
    content = content.replace(
      new RegExp(`from ['"]@/components/ui/${pattern}['"]`, 'g'),
      `from "@/components/ui/shadcn/${pattern}"`
    );
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed imports in ${file}`);
}

console.log('All shadcn imports fixed!');