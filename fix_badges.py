import os
import re

dir_path = 'src/app/siakad'

files_to_fix = [
    'src/app/siakad/kaprodi/dosen/page.js',
    'src/app/siakad/kaprodi/kalender/page.js',
    'src/app/siakad/mahasiswa/keuangan/page.js',
    'src/app/siakad/mahasiswa/surat/page.js',
    'src/app/siakad/admin/keuangan/page.js',
    'src/app/siakad/kaprodi/kurikulum/page.js',
    'src/app/siakad/kaprodi/monitoring/page.js'
]

# A regex to match style object props we want to strip
strip_props = ['padding', 'borderRadius', 'fontSize', 'fontWeight', 'display', 'alignItems', 'gap']

def clean_style(style_str):
    # Parse props
    props = re.findall(r"([a-zA-Z]+)\s*:\s*([^,}]+)", style_str)
    cleaned = []
    for prop, val in props:
        prop = prop.strip()
        val = val.strip()
        if prop not in strip_props:
            cleaned.append(f"{prop}: {val}")
    return ", ".join(cleaned)

for filepath in files_to_fix:
    if not os.path.exists(filepath):
        print(f"Skipping non-existent {filepath}")
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()
    
    # We want to find spans or divs that look like badges and convert them
    # Pattern matches: <(span|div) style={{ ... }}
    # Let's search specifically for tags that contain 'borderRadius' and 'background' and don't have 'siakad-badge'
    def repl(match):
        tag = match.group(1)
        style_content = match.group(2)
        
        # If it already has className="siakad-badge", skip
        if 'siakad-badge' in match.group(0):
            return match.group(0)
            
        # If it doesn't look like a status badge (must have background/color/borderRadius), skip
        if 'background' not in style_content or 'borderRadius' not in style_content:
            return match.group(0)
            
        cleaned_style = clean_style(style_content)
        return f'<{tag} className="siakad-badge" style={{{cleaned_style}}}'

    # Regex matching: <span style={{...}} or <div style={{...}}
    new_content = re.sub(
        r'<(span|div)\s+style=\{\{([^}]+)\}\}',
        repl,
        content
    )
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Successfully fixed badges in {filepath}")
    else:
        print(f"No changes needed for {filepath}")

