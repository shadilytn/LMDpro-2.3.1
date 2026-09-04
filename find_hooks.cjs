const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.tsx');
let found = false;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  let inComponent = false;
  let returned = false;
  let componentStart = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Naive component boundary detection
    if (line.includes('export const') && line.includes('React.FC')) {
      inComponent = true;
      returned = false;
      componentStart = i;
    }
    
    if (inComponent) {
      if (line.match(/^\s*if\s*\([^)]+\)\s*return/)) {
        returned = true;
      }
      
      if (returned && line.match(/^\s*const\s+\[.*\]\s*=\s*use/)) {
        console.log(`Found hook after early return in ${file}:${i+1}`);
        console.log(`Return was at ${file}:${i}`);
        found = true;
      }
    }
  }
}

if (!found) console.log('No hooks after early returns found');
