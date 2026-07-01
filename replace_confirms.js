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
    if (content.includes('confirm(')) {
      // Use negative lookbehind to avoid replacing window.toast.confirm( if already there
      const newContent = content.replace(/(?<!window\.toast\.)\bconfirm\(/g, 'await window.toast.confirm(');
      
      // Make sure the containing function is async, but all known ones already are async.
      // If we find any issues we can fix them manually.
      
      fs.writeFileSync(filePath, newContent);
      count++;
    }
  }
});

console.log(`Replaced native confirms in ${count} files.`);
