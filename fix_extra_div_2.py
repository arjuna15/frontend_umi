import os
import re

files = [
    'src/app/siakad/mahasiswa/bimbingan/page.js',
    'src/app/siakad/dosen/gradebook/page.js',
    'src/app/siakad/dosen/presensi/page.js',
    'src/app/siakad/dosen/forum/page.js',
    'src/app/siakad/dosen/elearning/quiz/page.js',
    'src/app/siakad/dosen/elearning/page.js'
]

for file_path in files:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r') as f:
        content = f.read()

    new_content = re.sub(r'</div>\s*</div>\s*</div>\s*<div className="siakad-card', '</div>\n      </div>\n\n      <div className="siakad-card', content)
    
    if new_content != content:
        with open(file_path, 'w') as f:
            f.write(new_content)
        print(f"Fixed extra div in {file_path}")

