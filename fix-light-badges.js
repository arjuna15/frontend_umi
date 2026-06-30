const fs = require('fs');

const files = [
  './src/app/siakad/kaprodi/monitoring/page.js',
  './src/app/siakad/kaprodi/students/page.js',
  './src/app/siakad/kaprodi/plotting/page.js',
  './src/app/siakad/kaprodi/krs/page.js',
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');

    // kaprodi/monitoring
    content = content.replace(/background:\s*'var\(--glass-bg\)',\s*color:\s*'var\(--color-text\)'\s*\}\}>Lancar/g, "background: '#dcfce7', color: '#166534' }}>Lancar");
    content = content.replace(/background:\s*'var\(--glass-bg\)',\s*color:\s*'#d97706'/g, "background: '#fef3c7', color: '#b45309'");
    content = content.replace(/background:\s*'var\(--glass-bg\)',\s*color:\s*'#dc2626'/g, "background: '#fee2e2', color: '#b91c1c'");
    
    // kaprodi/students
    content = content.replace(/background:\s*'var\(--glass-bg\)',\s*color:\s*'#ef4444'/g, "background: '#fee2e2', color: '#b91c1c'");
    content = content.replace(/background:\s*'var\(--glass-bg\)',\s*color:\s*'var\(--color-text\)'\s*\}\}>Lulus/g, "background: '#dcfce7', color: '#166534' }}>Lulus");

    // kaprodi/krs
    // Fix Tolak button
    content = content.replace(/background:\s*'var\(--glass-bg\)',\s*color:\s*'white',\s*border:\s*'none',/g, "background: '#ef4444', color: 'white', border: 'none',");
    
    fs.writeFileSync(f, content);
  }
});

// Also fix siakad.css to make sure all badges in light mode with var(--glass-bg) get a proper gray if missed
const cssPath = './src/app/siakad/siakad.css';
let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes("LIGHT MODE BADGE FALLBACK")) {
  const extraCss = `
/* LIGHT MODE BADGE FALLBACK */
[data-theme='light'] .siakad-badge[style*="var(--glass-bg)"] {
  background: #e5e7eb !important;
  color: #374151 !important;
}
[data-theme='light'] .siakad-badge[style*="color: var(--color-text)"] {
  color: #1f2937 !important;
}
`;
  fs.writeFileSync(cssPath, css + extraCss);
}

console.log('Fixed light mode badges and Tolak button!');
