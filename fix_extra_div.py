import os
import re

files = [
    'src/app/siakad/kaprodi/monitoring/page.js',
    'src/app/siakad/kaprodi/students/page.js',
    'src/app/siakad/kaprodi/plotting/page.js',
    'src/app/siakad/kaprodi/reports/page.js',
    'src/app/siakad/kaprodi/krs/page.js',
    'src/app/siakad/kaprodi/edom/page.js'
]

for file_path in files:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r') as f:
        content = f.read()

    # The hero ends with:
    #         </div>
    #       </div>
    # 
    #       </div>
    #
    #       <div className="siakad-card stagger-1" ...
    
    # Let's target exactly the extra </div> before siakad-card
    # We want to replace "</div>\s*</div>\s*<div className=\"siakad-card" with "</div>\n\n      <div className=\"siakad-card"
    # Actually wait, the hero itself ends with two </div>
    # So the pattern is three </div> in a row, before siakad-card
    
    new_content = re.sub(r'</div>\s*</div>\s*</div>\s*<div className="siakad-card', '</div>\n      </div>\n\n      <div className="siakad-card', content)
    
    if new_content != content:
        with open(file_path, 'w') as f:
            f.write(new_content)
        print(f"Fixed extra div in {file_path}")

