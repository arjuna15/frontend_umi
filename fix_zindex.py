import re

filepath = 'src/app/siakad/siakad.css'
with open(filepath, 'r') as f:
    content = f.read()

# Replace the staggering animation block with added z-indexes
old_block = """
.siakad-modal-content form > div:nth-child(1) { animation-delay: 0.1s; }
.siakad-modal-content form > div:nth-child(2) { animation-delay: 0.15s; }
.siakad-modal-content form > div:nth-child(3) { animation-delay: 0.2s; }
.siakad-modal-content form > div:nth-child(4) { animation-delay: 0.25s; }
.siakad-modal-content form > div:nth-child(5) { animation-delay: 0.3s; }
.siakad-modal-content form > div:nth-child(6) { animation-delay: 0.35s; }
"""

new_block = """
.siakad-modal-content form > div {
  animation: slideUpFade 0.4s ease forwards;
  opacity: 0;
  transform: translateY(15px);
  position: relative; /* Fix z-index stacking context for dropdowns */
}
.siakad-modal-content form > div:nth-child(1) { animation-delay: 0.1s; z-index: 60; }
.siakad-modal-content form > div:nth-child(2) { animation-delay: 0.15s; z-index: 59; }
.siakad-modal-content form > div:nth-child(3) { animation-delay: 0.2s; z-index: 58; }
.siakad-modal-content form > div:nth-child(4) { animation-delay: 0.25s; z-index: 57; }
.siakad-modal-content form > div:nth-child(5) { animation-delay: 0.3s; z-index: 56; }
.siakad-modal-content form > div:nth-child(6) { animation-delay: 0.35s; z-index: 55; }
.siakad-modal-content form > div:nth-child(7) { animation-delay: 0.4s; z-index: 54; }
.siakad-modal-content form > div:nth-child(8) { animation-delay: 0.45s; z-index: 53; }
.siakad-modal-content form > div:nth-child(9) { animation-delay: 0.5s; z-index: 52; }
.siakad-modal-content form > div:nth-child(10) { animation-delay: 0.55s; z-index: 51; }
"""

content = re.sub(
    r'\.siakad-modal-content form > div \{(.*?)\}\s*' + re.escape(old_block.strip()),
    new_block.strip(),
    content,
    flags=re.DOTALL
)

with open(filepath, 'w') as f:
    f.write(content)
print("z-index fixed!")
