import os

siakad_dir = 'src/app/siakad'
page_files = []

for root, dirs, files in os.walk(siakad_dir):
    for f in files:
        if f == 'page.js':
            page_files.append(os.path.join(root, f))

print(f"Total page.js files: {len(page_files)}")
no_fetch_files = []
for p in page_files:
    with open(p, 'r') as f:
        content = f.read()
    if 'fetch(' not in content and 'localStorage' not in content:
        # Check if there is mock data in the file
        if 'const [' in content and ('= useState([' in content or '= useState([{' in content):
            no_fetch_files.append(p)

print("\nFiles with state-based mock data and NO fetch calls (probably hardcoded/not connected):")
for f in no_fetch_files:
    print(f)

