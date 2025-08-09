const fs = require('fs');
const path = require('path');

const replacements = [
  // Shared components
  [/from ['"]@\/components\/page\/DefaultLayout['"]/g, "from '@/components/shared/default-layout'"],
  [/from ['"]@\/components\/FooterNavigation['"]/g, "from '@/components/shared/footer-navigation'"],
  [/from ['"]@\/components\/BlockLoader['"]/g, "from '@/components/shared/block-loader'"],
  [/from ['"]@\/components\/ThemeSwitcher['"]/g, "from '@/components/shared/theme-switcher'"],
  [/from ['"]@\/components\/page\/root\.module\.scss['"]/g, "from '@/components/shared/root.module.scss'"],
  [/from ['"]@\/components\/providers\/LenisProvider['"]/g, "from '@/components/shared/lenis-provider'"],
  [/from ['"]@\/components\/providers\/ThemeProvider['"]/g, "from '@/components/shared/theme-provider'"],
  [/from ['"]@\/components\/providers\/ThemeColorProvider['"]/g, "from '@/components/shared/theme-color-provider'"],
  
  // App-specific components
  [/from ['"]@\/components\/ProjectAccordion['"]/g, "from '@/components/app/projects/project-accordion'"],
  [/from ['"]@\/components\/three\/FloatingScene['"]/g, "from '@/components/app/scroll/floating-scene'"],
  [/from ['"]@\/components\/three\/ProjectIcons['"]/g, "from '@/components/app/scroll/project-icons'"],
  [/from ['"]@\/components\/motion['"]/g, "from '@/components/ui/motion'"],
  
  // Internal component imports
  [/from ['"]\.\/SineMoodRingIcon['"]/g, "from './sine-mood-ring-icon'"],
  [/from ['"]\.\.\/effects\/(.*?)\.json['"]/g, "from './$1.json'"],
  [/import styles from ['"]\.\/(.*)\.module\.scss['"]/g, (match, name) => {
    const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    return `import styles from './${kebabName}.module.scss'`;
  }],
];

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const [pattern, replacement] of replacements) {
    const newContent = content.replace(pattern, replacement);
    if (newContent !== content) {
      modified = true;
      content = newContent;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      updateFile(filePath);
    }
  }
}

// Run the script
walkDir('./src');
console.log('Import updates complete!');