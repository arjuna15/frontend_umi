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
    if (content.includes('alert(')) {
      // We will replace alert( with window.toast(
      const newContent = content.replace(/\balert\(/g, 'window.toast(');
      fs.writeFileSync(filePath, newContent);
      count++;
    }
  }
});

console.log(`Replaced native alerts in ${count} files.`);
