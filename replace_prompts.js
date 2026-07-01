const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

let count = 0;
walk('./src/app/siakad', (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('prompt(')) {
      // Use negative lookbehind to avoid double-replacing
      const newContent = content.replace(/(?<!window\.toast\.)\bprompt\(/g, 'await window.toast.prompt(');
      
      fs.writeFileSync(filePath, newContent);
      count++;
    }
  }
});

console.log(`Replaced native prompts in ${count} files.`);
