const fs = require('fs');
const cssPath = './src/app/siakad/siakad.css';

let css = fs.readFileSync(cssPath, 'utf8');

if (!css.includes('.btn-logout {')) {
  const extraCss = `
/* Logout Button Fix */
.btn-logout {
  width: 100%;
  padding: 14px;
  background: var(--glass-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
  font-weight: bold;
  font-size: 0.95rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
}

.btn-logout:hover {
  background: #fee2e2;
  color: #ef4444;
  border-color: #fca5a5;
  transform: translateY(-2px);
}

[data-theme='dark'] .btn-logout {
  border: 1px solid rgba(255,255,255,0.1);
}

[data-theme='dark'] .btn-logout:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  border-color: rgba(239, 68, 68, 0.4);
}
`;
  fs.writeFileSync(cssPath, css + extraCss);
}
console.log('Fixed btn-logout');
