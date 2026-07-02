import os
import re

dir_path = 'src/app/siakad'

overlay_pattern = re.compile(
    r'<div\s+style=\{\{\s*position:\s*[\'"]fixed[\'"]\s*,\s*(?:inset:\s*0\s*,|top:\s*0\s*,\s*left:\s*0\s*,\s*right:\s*0\s*,\s*bottom:\s*0\s*,)[^\}]+\}\}\s*>',
    re.MULTILINE | re.IGNORECASE
)

content_pattern_1 = re.compile(
    r'<div\s+style=\{\{\s*(?:background|backgroundColor):\s*(?:[\'"]var\(--color-bg\)[\'"]|[\'"]white[\'"]|[\'"]#fff[\'"])[^\}]*(?:maxWidth|width)[^\}]+\}\}\s*>',
    re.MULTILINE | re.IGNORECASE
)

count = 0
for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith('.js'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            new_content = overlay_pattern.sub('<div className="siakad-modal-overlay">', content)
            
            # For content, we want to make sure it's actually the modal content (usually width/maxWidth, borderRadius, padding)
            # Let's see if we can just match it safely. If it has max-width and background, it's likely the modal content.
            def content_replacer(match):
                original = match.group(0)
                # Keep any onClick or other attributes if present? Usually there are none on the content wrapper.
                # Actually, some might have `className="fade-in"` or `siakad-card`. We will just strip style.
                return '<div className="siakad-modal-content">'
                
            new_content = content_pattern_1.sub(content_replacer, new_content)
            
            # Let's also do header if it matches display: flex, justify-content: space-between, align-items: center
            header_pattern = re.compile(
                r'<div\s+style=\{\{\s*display:\s*[\'"]flex[\'"]\s*,\s*justifyContent:\s*[\'"]space-between[\'"][^\}]+\}\}\s*>',
                re.MULTILINE | re.IGNORECASE
            )
            def header_replacer(match):
                # Only replace if it has space-between and some margin-bottom (typical header)
                if 'marginBottom' in match.group(0) or 'paddingBottom' in match.group(0) or 'alignItems' in match.group(0):
                    return '<div className="siakad-modal-header">'
                return match.group(0)
            
            new_content = header_pattern.sub(header_replacer, new_content)
            
            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
                count += 1

print(f"Total files updated: {count}")
