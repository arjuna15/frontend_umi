import re
import os

files = [
    'src/app/siakad/mahasiswa/bimbingan/page.js',
    'src/app/siakad/dosen/gradebook/page.js',
    'src/app/siakad/dosen/presensi/page.js',
    'src/app/siakad/dosen/forum/page.js',
    'src/app/siakad/dosen/elearning/quiz/page.js'
]

hero_template = """      <div style={{ marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c0519 100%)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(196,30,58,0.15)', filter: 'blur(40px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }}></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
            {back_button}
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 8px 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SIAKAD — {role}</p>
              <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>{title}</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>{desc}</p>
            </div>
          </div>
        </div>
      </div>"""

for fpath in files:
    if not os.path.exists(fpath):
        continue
    with open(fpath, 'r') as f:
        content = f.read()
    
    role = "DOSEN" if "dosen" in fpath else "MAHASISWA"

    # Match the <div style={{ marginBottom: '30px'... }}> block
    # We look for <div style={{ marginBottom: ... }}> and the matching closing </div> before <form> or <div className="siakad-card"
    # A safer regex: find everything from <div className="fade-in"[^>]*> to the first <form> or <div className="siakad-card
    match = re.search(r'(<div className="fade-in"[^>]*>\s*)(<div style={{ marginBottom[^>]*>.*?</div>\s*)\n\s*(?:<form|<div className="siakad-card|<div style={{ display: \'grid\')', content, re.DOTALL)
    if match:
        prefix = match.group(1)
        header_block = match.group(2)
        
        # extract title and desc
        title_match = re.search(r'<h[12][^>]*>(.*?)</h[12]>', header_block, re.DOTALL)
        desc_match = re.search(r'<p[^>]*>(.*?)</p>', header_block, re.DOTALL)
        
        if title_match and desc_match:
            title_raw = title_match.group(1).strip()
            title = re.sub(r'<[^>]+>', '', title_raw).strip()
            desc_raw = desc_match.group(1).strip()
            desc = re.sub(r'<[^>]+>', '', desc_raw).strip()
            
            back_button = ""
            if "router.back()" in header_block:
                back_button = """<button onClick={() => router.back()} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}>
              <i className="ph ph-arrow-left"></i> Kembali
            </button>"""
            
            new_header = hero_template.replace('{title}', title).replace('{desc}', desc).replace('{role}', role).replace('{back_button}', back_button)
            
            new_content = content[:match.start(2)] + new_header + "\n" + content[match.end(2):]
            
            # ensure siakad-table is applied
            if '<table' in new_content and 'siakad-table' not in new_content:
                new_content = new_content.replace('<table', '<table className="siakad-table"')
                
            with open(fpath, 'w') as f:
                f.write(new_content)
            print(f"Successfully replaced in {fpath}")
        else:
            print(f"Could not find title/desc in {fpath}")
    else:
        print(f"Regex failed for {fpath}")
