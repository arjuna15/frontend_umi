const fs = require('fs');

// 1. Fix siakad.css
const cssPath = './src/app/siakad/siakad.css';
let css = fs.readFileSync(cssPath, 'utf8');

const ultimateOverrides = `
/* =========================================================
   ULTIMATE GOD-TIER DARK MODE OVERRIDES (WILDCARDS)
   ========================================================= */

/* Fix ALL Tables globally inside SIAKAD */
[data-theme='dark'] .siakad-container table,
[data-theme='dark'] .siakad-container table tbody,
[data-theme='dark'] .siakad-container table thead,
[data-theme='dark'] .siakad-container table tr,
[data-theme='dark'] .siakad-container table th,
[data-theme='dark'] .siakad-container table td {
  background: transparent !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: var(--color-text) !important;
}

[data-theme='dark'] .siakad-container table tbody tr:hover {
  background: rgba(255, 255, 255, 0.05) !important;
}

[data-theme='dark'] .siakad-container table th {
  background: rgba(0, 0, 0, 0.2) !important;
}

/* Fix ALL Inputs, Textareas, and Selects globally */
[data-theme='dark'] .siakad-container input,
[data-theme='dark'] .siakad-container textarea,
[data-theme='dark'] .siakad-container select {
  background: rgba(15, 23, 42, 0.6) !important;
  color: var(--color-text) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

[data-theme='dark'] .siakad-container input::placeholder,
[data-theme='dark'] .siakad-container textarea::placeholder {
  color: var(--color-muted) !important;
}

/* Fix any stray text colors inside inline styles */
[data-theme='dark'] .siakad-container [style*="color: #0f172a"],
[data-theme='dark'] .siakad-container [style*="color: #1e293b"],
[data-theme='dark'] .siakad-container [style*="color: #374151"],
[data-theme='dark'] .siakad-container [style*="color: #475569"],
[data-theme='dark'] .siakad-container [style*="color: #111827"] {
  color: var(--color-text) !important;
}

[data-theme='dark'] .siakad-container [style*="color: #64748b"],
[data-theme='dark'] .siakad-container [style*="color: #94a3b8"],
[data-theme='dark'] .siakad-container [style*="color: #6b7280"] {
  color: var(--color-muted) !important;
}
`;

fs.writeFileSync(cssPath, css + ultimateOverrides);

// 2. Fix CustomSelect.js
const selectPath = './src/app/siakad/components/CustomSelect.js';
if (fs.existsSync(selectPath)) {
  let selectJs = fs.readFileSync(selectPath, 'utf8');
  selectJs = selectJs.replace(/background:\s*disabled \? '#f1f5f9' : '#ffffff'/g, "background: disabled ? 'var(--glass-bg)' : 'var(--color-bg)'");
  selectJs = selectJs.replace(/color:\s*selectedOption \? '#0f172a' : '#94a3b8'/g, "color: selectedOption ? 'var(--color-text)' : 'var(--color-muted)'");
  selectJs = selectJs.replace(/border:\s*isOpen \? '2px solid #3b82f6' : '1px solid #cbd5e1'/g, "border: isOpen ? '2px solid #3b82f6' : '1px solid var(--color-border)'");
  selectJs = selectJs.replace(/border:\s*'1px solid #e2e8f0'/g, "border: '1px solid var(--color-border)'");
  fs.writeFileSync(selectPath, selectJs);
}

console.log('Applied ultimate dark mode fixes!');
