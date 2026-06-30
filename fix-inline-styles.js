const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/app/siakad', function(filePath) {
  if (filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace ANY inline text colors that are dark (e.g. #1e293b, #475569) with CSS variables
    // Dark colors usually start with #1, #2, #3, #4, #5, #6, #7, #8, #9 in RGB
    content = content.replace(/color:\s*['"]#[0-9a-c][0-9a-f]{5}['"]/gi, "color: 'var(--color-text)'");
    
    // Replace light text colors slightly
    content = content.replace(/color:\s*['"]#64748b['"]/gi, "color: 'var(--color-muted)'");
    content = content.replace(/color:\s*['"]#94a3b8['"]/gi, "color: 'var(--color-muted)'");
    
    // Replace light background colors (e.g. #f8fafc, #fef2f2, #fff7ed, #e0e7ff)
    // We will use rgba(128, 128, 128, 0.1) as a generic transparent overlay that works on both light/dark
    content = content.replace(/background:\s*['"]#[def][0-9a-f]{5}['"]/gi, "background: 'var(--glass-bg)'");
    
    // Also catch backgroundColor
    content = content.replace(/backgroundColor:\s*['"]#[def][0-9a-f]{5}['"]/gi, "backgroundColor: 'var(--glass-bg)'");

    // Replace specific ternary inline styles found in mahasiswa dashboard
    content = content.replace(/deadline\.due_in_days <= 1 \? '#fef2f2' : '#fff7ed'/g, "deadline.due_in_days <= 1 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(249, 115, 22, 0.1)'");
    content = content.replace(/deadline\.due_in_days <= 1 \? '#fecaca' : '#fed7aa'/g, "deadline.due_in_days <= 1 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(249, 115, 22, 0.3)'");
    
    // Fix table headers / rows that might have light rgba backgrounds
    content = content.replace(/background:\s*['"]rgba\([0-9]+,\s*[0-9]+,\s*[0-9]+,\s*0\.[0-9]+\)['"]/g, "background: 'var(--glass-bg)'");
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Aggressively updated inline styles in: ${filePath}`);
    }
  }
});
