const fs = require('fs');
const path = './src/app/siakad/siakad.css';

let css = fs.readFileSync(path, 'utf8');

// Append specific dark mode overrides for anything that might still be hardcoded
const darkModeOverrides = `

/* =========================================================
   DARK MODE OVERRIDES FOR SIAKAD COMPONENTS
   ========================================================= */
[data-theme='dark'] .siakad-container {
  background: var(--color-bg);
  color: var(--color-text);
}

[data-theme='dark'] .siakad-sidebar,
[data-theme='dark'] .siakad-header,
[data-theme='dark'] .siakad-card,
[data-theme='dark'] .siakad-bottom-nav {
  background: var(--glass-bg);
  border-color: var(--color-border);
  box-shadow: var(--glass-shadow);
}

[data-theme='dark'] .siakad-sidebar {
  border-right: 1px solid var(--color-border);
}

[data-theme='dark'] .siakad-header {
  border-bottom: 1px solid var(--color-border);
}

[data-theme='dark'] .siakad-nav-item,
[data-theme='dark'] .siakad-bottom-nav-item {
  color: var(--color-muted);
}

[data-theme='dark'] .siakad-nav-item:hover,
[data-theme='dark'] .siakad-bottom-nav-item.active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text);
}

[data-theme='dark'] .siakad-nav-item.active {
  background: var(--umiba-red-dark);
  color: #fff;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

[data-theme='dark'] .siakad-user-badge div {
  color: var(--color-text) !important;
}

[data-theme='dark'] h1, 
[data-theme='dark'] h2, 
[data-theme='dark'] h3, 
[data-theme='dark'] h4,
[data-theme='dark'] strong,
[data-theme='dark'] th {
  color: var(--color-text) !important;
}

[data-theme='dark'] p,
[data-theme='dark'] span,
[data-theme='dark'] td {
  color: var(--color-muted) !important;
}

[data-theme='dark'] table tr {
  border-bottom-color: var(--color-border) !important;
}

[data-theme='dark'] table thead tr {
  background: rgba(255, 255, 255, 0.05) !important;
}
`;

fs.writeFileSync(path, css + darkModeOverrides);
console.log('Successfully updated siakad.css with dark mode overrides.');
