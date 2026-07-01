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

hero_template = """
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — {role}</p>
          <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>{title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>{desc}</p>
        </div>
      </div>
"""

for file_path in files:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r') as f:
        content = f.read()

    role = "DOSEN" if "dosen" in file_path else "MAHASISWA"

    # Find the title pattern (usually h2 or h1 in the first div after fade-in)
    match = re.search(r'<h[12][^>]*>(.*?)</h[12]>.*?<p[^>]*>(.*?)</p>', content, re.DOTALL)
    if match:
        title_raw = match.group(1).strip()
        title = re.sub(r'<[^>]+>', '', title_raw).strip()
        desc_raw = match.group(2).strip()
        desc = re.sub(r'<[^>]+>', '', desc_raw).strip()

        new_hero = hero_template.replace('{title}', title).replace('{desc}', desc).replace('{role}', role)

        # Replace the old header div (usually <div style={{ marginBottom: '30px' }}> ... </div>)
        # Handle cases where it might not perfectly match the div by just replacing the matched heading and p tag,
        # but the wrapper div is tricky. We'll find the <div style={{ marginBottom: ... }}> block
        content = re.sub(r'<div[^>]*margin(?:Bottom)?:\s*\'(?:24|30|32)px\'[^>]*>.*?<h[12].*?</p>\s*</div>', new_hero, content, flags=re.DOTALL)
        
        # Also replace basic tables with siakad-card and siakad-table
        # For simplicity, if it's already using siakad-card, we leave it. If it has `<table`, we'll make sure it's `<table className="siakad-table"`
        if '<table' in content and 'siakad-table' not in content:
            content = content.replace('<table', '<table className="siakad-table"')
            
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Updated {file_path}")
    else:
        print(f"Could not parse title/desc for {file_path}")

