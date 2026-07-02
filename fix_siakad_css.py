import re

filepath = 'src/app/siakad/siakad.css'
with open(filepath, 'r') as f:
    content = f.read()

# Fix the modal content - remove the ugly smudges (before/after)
content = re.sub(r'\.siakad-modal-content::before\s*\{[^}]+\}', '', content)
content = re.sub(r'\.siakad-modal-content::after\s*\{[^}]+\}', '', content)
content = re.sub(r'\[data-theme=\'dark\'\]\s*\.siakad-modal-content::before\s*\{[^}]+\}', '', content)
content = re.sub(r'\[data-theme=\'dark\'\]\s*\.siakad-modal-content::after\s*\{[^}]+\}', '', content)

# Update modal content to be simpler and cleaner, no weird gradients
new_modal_content = """
.siakad-modal-content {
  background: var(--color-bg);
  width: 100%;
  max-width: 600px;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: modalScaleIn 0.3s ease-out forwards;
  position: relative;
}

[data-theme='dark'] .siakad-modal-content {
  background: var(--glass-bg) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6) !important;
}
"""
content = re.sub(r'\.siakad-modal-content\s*\{[^}]+\}', new_modal_content, content, count=1)
content = re.sub(r'\[data-theme=\'dark\'\]\s*\.siakad-modal-content\s*\{[^}]+\}', '', content) # Already handled in new_modal_content

# Fix the inputs - make them solid and visible!
content = re.sub(r'(\.siakad-input,\s*\.siakad-select,\s*\.siakad-modal-content\s*input,\s*\.siakad-modal-content\s*select\s*\{)[^}]+(\})',
r'''\1
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--color-border) !important;
  background: rgba(255,255,255,0.5) !important;
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.2s ease;
\2''', content)

# Fix dark mode inputs
content = re.sub(r'(\[data-theme=\'dark\'\]\s*\.siakad-input,\s*\[data-theme=\'dark\'\]\s*\.siakad-select,\s*\[data-theme=\'dark\'\]\s*\.siakad-modal-content\s*input,\s*\[data-theme=\'dark\'\]\s*\.siakad-modal-content\s*select\s*\{)[^}]+(\})',
r'''\1
  background: rgba(0,0,0,0.2) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  color: white;
\2''', content)

with open(filepath, 'w') as f:
    f.write(content)
print("CSS fixed!")
