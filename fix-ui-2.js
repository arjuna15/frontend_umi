const fs = require('fs');

// 1. Fix IPS Logo in mahasiswa/gradebook/page.js
const mGradebook = './src/app/siakad/mahasiswa/gradebook/page.js';
if (fs.existsSync(mGradebook)) {
  let content = fs.readFileSync(mGradebook, 'utf8');
  content = content.replace(/background:\s*'var\(--glass-bg\)',\s*borderRadius:\s*'16px',\s*display:\s*'flex'/g, 
    "background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex'");
  // Also the second card in gradebook "Total SKS Lulus"
  content = content.replace(/background:\s*'var\(--glass-bg\)',\s*color:\s*'var\(--color-text\)',\s*borderRadius:\s*'16px',\s*display:\s*'flex'/g, 
    "background: 'var(--glass-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '16px', display: 'flex'");
  fs.writeFileSync(mGradebook, content);
}

// 2. Fix CSS in siakad.css for Badge, User Badge, and prevent transparent badges
const cssPath = './src/app/siakad/siakad.css';
let css = fs.readFileSync(cssPath, 'utf8');

const extraCss = `
/* GOD-TIER FINAL TWEAKS 2 */

/* Make all badges consistent in size */
.siakad-badge {
  min-width: 90px;
  text-align: center;
  display: inline-flex !important;
  justify-content: center;
  align-items: center;
  padding: 6px 12px !important;
}

/* Ensure badges don't turn completely transparent in dark mode */
[data-theme='dark'] .siakad-badge[style*="background: transparent"] {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #d1d5db !important;
}

[data-theme='dark'] .siakad-badge[style*="background: #f3f4f6"],
[data-theme='dark'] .siakad-badge[style*="background: #f8fafc"],
[data-theme='dark'] .siakad-container [style*="background: #f3f4f6"].siakad-badge {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #e5e7eb !important;
}

[data-theme='dark'] .siakad-badge[style*="background: #ecfdf5"] {
  background: rgba(16, 185, 129, 0.2) !important;
  color: #34d399 !important;
}

[data-theme='dark'] .siakad-badge[style*="background: #eff6ff"] {
  background: rgba(59, 130, 246, 0.2) !important;
  color: #93c5fd !important;
}

[data-theme='dark'] .siakad-badge[style*="background: #fef2f2"] {
  background: rgba(239, 68, 68, 0.2) !important;
  color: #fca5a5 !important;
}

[data-theme='dark'] .siakad-user-badge {
  background: var(--glass-bg) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}
[data-theme='dark'] .siakad-user-badge:hover {
  background: rgba(255, 255, 255, 0.05) !important;
}
`;

if (!css.includes("GOD-TIER FINAL TWEAKS 2")) {
  fs.writeFileSync(cssPath, css + extraCss);
}

console.log('Fixed final UI issues part 2!');
