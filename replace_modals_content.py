import os
import re

dir_path = 'src/app/siakad'

# Pattern to find the inner div right after siakad-modal-overlay
pattern = re.compile(
    r'(<div className="siakad-modal-overlay">\s*)<div\s+className="[^"]*fade-in[^"]*"\s+style=\{[^>]+>',
    re.MULTILINE | re.IGNORECASE
)

count = 0
for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith('.js'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            new_content = pattern.sub(r'\1<div className="siakad-modal-content">', content)
            
            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
                count += 1

print(f"Total files updated: {count}")
