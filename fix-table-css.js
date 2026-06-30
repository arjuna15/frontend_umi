const fs = require('fs');
const path = './src/app/siakad/siakad.css';

let css = fs.readFileSync(path, 'utf8');

const tableOverrides = `

/* ====== AGGRESSIVE TABLE & COMPONENT OVERRIDES ====== */
[data-theme='dark'] .siakad-table,
[data-theme='dark'] .siakad-table tbody,
[data-theme='dark'] .siakad-table thead,
[data-theme='dark'] .siakad-table tr,
[data-theme='dark'] .siakad-table th,
[data-theme='dark'] .siakad-table td {
  background: transparent !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

[data-theme='dark'] .siakad-table tbody tr {
  background: transparent !important;
}

[data-theme='dark'] .siakad-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.05) !important;
}

[data-theme='dark'] .siakad-table th {
  background: rgba(0, 0, 0, 0.2) !important;
  color: var(--color-text) !important;
}

[data-theme='dark'] .siakad-table td {
  color: var(--color-muted) !important;
}

/* Any remaining generic light backgrounds from siakad.css */
[data-theme='dark'] .siakad-dropdown-menu,
[data-theme='dark'] .siakad-mega-menu,
[data-theme='dark'] .siakad-modal-content {
  background: var(--glass-bg) !important;
  border-color: rgba(255,255,255,0.1) !important;
}
`;

fs.writeFileSync(path, css + tableOverrides);
console.log('Successfully added aggressive table overrides to siakad.css');
