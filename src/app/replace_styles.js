const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'page.js',
  'profil/page.js',
  'mutu/page.js',
  'pmb/page.js',
  'berita/page.js',
  'akademik/page.js',
  'lppm/page.js'
];

for (const file of filesToProcess) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace inline glass backgrounds and backdrop filters
    content = content.replace(/background:\s*'rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)'/g, "background: 'var(--glass-bg)'");
    content = content.replace(/backdropFilter:\s*'blur\([0-9]+px\)'/g, "/* backdrop-removed */");
    content = content.replace(/WebkitBackdropFilter:\s*'blur\([0-9]+px\)'/g, "/* webkit-backdrop-removed */");

    // Replace borders to transparent or subtle solid
    content = content.replace(/border:\s*'1px solid rgba\(255,255,255,0\.[0-9]+\)'/g, "border: 'none'");

    // Replace box shadows
    content = content.replace(/boxShadow:\s*'0 8px 32px rgba\(0,0,0,0\.3\)'/g, "boxShadow: 'var(--glass-shadow)'");
    content = content.replace(/boxShadow:\s*'0 6px 20px rgba\(255,\s*255,\s*255,\s*0\.3\)'/g, "boxShadow: 'var(--glass-shadow)'");
    content = content.replace(/boxShadow:\s*'0 6px 20px rgba\(255,255,255,0\.3\)'/g, "boxShadow: 'var(--glass-shadow)'");
    content = content.replace(/boxShadow:\s*'0 4px 10px rgba\(0,0,0,0\.2\)'/g, "boxShadow: 'var(--glass-shadow)'");
    content = content.replace(/boxShadow:\s*'0 2px 6px rgba\(0,0,0,0\.2\)'/g, "boxShadow: 'var(--glass-shadow)'");

    // Replaces in globals.css for class styles
    content = content.replace(/className="([^"]*)glass glass-card([^"]*)"/g, 'className="$1neu-card$2" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px" }}');
    // For exact match
    content = content.replace(/className="glass"/g, 'className="neu-card" style={{ background: "var(--glass-bg)", boxShadow: "var(--glass-shadow)", border: "none", borderRadius: "16px" }}');
    // Replace btn-glass
    content = content.replace(/btn-glass/g, 'btn-neu');

    // Remove comma artifacts just in case
    content = content.replace(/,\s*\/\* backdrop-removed \*\//g, '');
    content = content.replace(/,\s*\/\* webkit-backdrop-removed \*\//g, '');
    content = content.replace(/\/\* backdrop-removed \*\/\s*,/g, '');
    content = content.replace(/\/\* webkit-backdrop-removed \*\/\s*,/g, '');

    fs.writeFileSync(filePath, content);
    console.log(`Replaced successfully in ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
}
