import re

filepath = 'src/app/siakad/siakad.css'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Update siakad-modal-content
new_modal_css = """
.siakad-modal-content {
  background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%);
  width: 100%;
  max-width: 600px;
  border-radius: 28px;
  /* padding removed to allow edge-to-edge headers */
  box-shadow: 
    0 25px 50px -12px rgba(0,0,0,0.25), 
    0 0 0 1px rgba(255,255,255,0.9) inset,
    0 20px 40px rgba(99,102,241,0.05); /* subtle glow */
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: modalScaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  position: relative;
  overflow: hidden;
}

/* Luxurious Gradient Accents */
.siakad-modal-content::before {
  content: '';
  position: absolute;
  top: -50px; left: -50px;
  width: 150px; height: 150px;
  background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.siakad-modal-content::after {
  content: '';
  position: absolute;
  bottom: -50px; right: -50px;
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

[data-theme='dark'] .siakad-modal-content {
  background: linear-gradient(135deg, var(--color-bg) 0%, rgba(15,23,42,0.95) 100%) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  box-shadow: 
    0 25px 50px -12px rgba(0,0,0,0.6), 
    0 0 0 1px rgba(255,255,255,0.05) inset,
    0 20px 40px rgba(99,102,241,0.1) !important;
}

[data-theme='dark'] .siakad-modal-content::before { background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%); }
[data-theme='dark'] .siakad-modal-content::after { background: radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%); }
"""

# Replace existing siakad-modal-content block
content = re.sub(
    r'\.siakad-modal-content\s*\{[^}]+\}', 
    '', 
    content
)
content = re.sub(
    r'\[data-theme=\'dark\'\]\s*\.siakad-modal-content\s*\{[^}]+\}', 
    '', 
    content
)

# 2. Append new inputs and button overrides
additional_css = """
/* =========================================================
   LUXURY FORM INPUTS & BUTTONS
   ========================================================= */

.siakad-input, .siakad-select, .siakad-modal-content input, .siakad-modal-content select {
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.05) !important;
  background: rgba(0,0,0,0.02) !important;
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}

.siakad-input:focus, .siakad-select:focus, .siakad-modal-content input:focus, .siakad-modal-content select:focus {
  outline: none;
  background: white !important;
  border-color: #6366f1 !important;
  box-shadow: 0 0 0 4px rgba(99,102,241,0.15), inset 0 2px 4px rgba(0,0,0,0.01) !important;
  transform: translateY(-1px);
}

[data-theme='dark'] .siakad-input, [data-theme='dark'] .siakad-select, [data-theme='dark'] .siakad-modal-content input, [data-theme='dark'] .siakad-modal-content select {
  background: rgba(255,255,255,0.03) !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  color: white;
}

[data-theme='dark'] .siakad-input:focus, [data-theme='dark'] .siakad-select:focus {
  background: rgba(0,0,0,0.2) !important;
  border-color: #818cf8 !important;
  box-shadow: 0 0 0 4px rgba(129,140,248,0.2) !important;
}

/* Premium Buttons inside Modals */
.siakad-modal-content button[type="submit"],
.siakad-modal-content button.siakad-btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%) !important;
  color: white !important;
  padding: 12px 28px !important;
  border-radius: 12px !important;
  border: none !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  box-shadow: 0 8px 16px -4px rgba(99,102,241,0.4), inset 0 1px 1px rgba(255,255,255,0.2) !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  position: relative;
  overflow: hidden;
}

.siakad-modal-content button[type="submit"]:hover,
.siakad-modal-content button.siakad-btn-primary:hover {
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 12px 20px -4px rgba(99,102,241,0.5), inset 0 1px 1px rgba(255,255,255,0.3) !important;
}

.siakad-modal-content button[type="submit"]:active,
.siakad-modal-content button.siakad-btn-primary:active {
  transform: translateY(1px) scale(0.98) !important;
  box-shadow: 0 4px 8px -2px rgba(99,102,241,0.4) !important;
}

.siakad-modal-content button[type="button"]:not(.siakad-btn-primary) {
  background: transparent !important;
  color: var(--color-text) !important;
  padding: 12px 24px !important;
  border-radius: 12px !important;
  border: 1px solid var(--color-border) !important;
  font-weight: 600 !important;
  transition: all 0.2s ease !important;
}

.siakad-modal-content button[type="button"]:not(.siakad-btn-primary):hover {
  background: var(--color-border) !important;
}

/* Staggered form field entry animation */
.siakad-modal-content form > div {
  animation: slideUpFade 0.4s ease forwards;
  opacity: 0;
  transform: translateY(15px);
}
.siakad-modal-content form > div:nth-child(1) { animation-delay: 0.1s; }
.siakad-modal-content form > div:nth-child(2) { animation-delay: 0.15s; }
.siakad-modal-content form > div:nth-child(3) { animation-delay: 0.2s; }
.siakad-modal-content form > div:nth-child(4) { animation-delay: 0.25s; }
.siakad-modal-content form > div:nth-child(5) { animation-delay: 0.3s; }
.siakad-modal-content form > div:nth-child(6) { animation-delay: 0.35s; }

@keyframes slideUpFade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
"""

with open(filepath, 'w') as f:
    f.write(content + "\n" + new_modal_css + "\n" + additional_css)

print("siakad.css successfully upgraded with luxury UI components!")
