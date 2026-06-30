const fs = require('fs');

// 1. Fix IPS text color in mahasiswa/gradebook/page.js
const mGradebook = './src/app/siakad/mahasiswa/gradebook/page.js';
if (fs.existsSync(mGradebook)) {
  let content = fs.readFileSync(mGradebook, 'utf8');
  content = content.replace(/<p style=\{\{\s*margin:\s*'0 0 4px 0',\s*fontSize:\s*'0\.9rem',\s*color:\s*'var\(--color-text\)'\s*\}\}>Indeks Prestasi Semester<\/p>/, 
    "<p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#94a3b8' }}>Indeks Prestasi Semester</p>");
  fs.writeFileSync(mGradebook, content);
}

// 2. Fix Avatar & Button in mahasiswa/forum/page.js and dosen/forum/page.js
const forums = [
  './src/app/siakad/mahasiswa/forum/page.js',
  './src/app/siakad/dosen/forum/page.js'
];
forums.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    
    // Fix Buat Topik Baru button color
    content = content.replace(/background:\s*'#4f46e5',\s*color:\s*'var\(--color-text\)'/g, "background: '#4f46e5', color: 'white'");
    content = content.replace(/background:\s*'#4f46e5',\s*color:\s*'var\(--color-muted\)'/g, "background: '#4f46e5', color: 'white'");

    // Fix Avatar
    content = content.replace(/width:\s*'40px',\s*height:\s*'40px',\s*background:\s*'var\(--glass-bg\)',\s*color:\s*'var\(--color-text\)'/g, 
      "width: '40px', height: '40px', background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', border: '1px solid rgba(99, 102, 241, 0.3)'");
    
    // Fix course header (linear-gradient)
    content = content.replace(/background:\s*'var\(--glass-bg\)',\s*padding:\s*'20px 24px',\s*borderBottom:\s*'1px solid rgba\(199, 210, 254, 0\.3\)'/g, 
      "background: 'linear-gradient(90deg, rgba(238,242,255,0.8) 0%, rgba(255,255,255,0) 100%)', padding: '20px 24px', borderBottom: '1px solid var(--color-border)'");
    // Make sure course title is readable
    content = content.replace(/color:\s*'var\(--color-text\)',\s*fontWeight:\s*'bold'\s*\}\}>\{course\.name\}<\/h3>/g, 
      "color: '#3730a3', fontWeight: 'bold' }}>{course.name}</h3>");
    // wait, in my aggressive script I might have replaced #3730a3 with var(--color-text).
    // Let's just fix any color: var(--color-text) inside the course name.
    
    fs.writeFileSync(f, content);
  }
});

// 3. Fix Upload / Link Meet buttons in dosen/elearning/page.js
const elearning = './src/app/siakad/dosen/elearning/page.js';
if (fs.existsSync(elearning)) {
  let content = fs.readFileSync(elearning, 'utf8');
  content = content.replace(/<button style=\{\{\s*background:\s*'transparent'/g, "<button onClick={() => alert('Simulasi: Berhasil membuka aksi!')} style={{ background: 'transparent'");
  fs.writeFileSync(elearning, content);
}

// 4. Fix Portal Akademik button in layout.js
const layout = './src/app/siakad/layout.js';
if (fs.existsSync(layout)) {
  let content = fs.readFileSync(layout, 'utf8');
  content = content.replace(/background:\s*'#f1f5f9'/g, "background: 'var(--glass-bg)'");
  content = content.replace(/background:\s*'var\(--color-bg\)'/g, "background: 'var(--glass-bg)'");
  fs.writeFileSync(layout, content);
}

// 5. CSS fix for forum topic text being unreadable in dark mode
// The topic header text might be using #3730a3 which is very dark on a dark background.
// We can use a CSS override for dark mode:
const cssPath = './src/app/siakad/siakad.css';
let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes("GOD-TIER FORUM TWEAKS")) {
  const extraCss = `
/* GOD-TIER FORUM TWEAKS */
[data-theme='dark'] .siakad-container [style*="color: #3730a3"] {
  color: #a5b4fc !important;
}
[data-theme='dark'] .siakad-container [style*="color: #4f46e5"] {
  color: #818cf8 !important;
}
[data-theme='dark'] .siakad-container [style*="background: linear-gradient(90deg, rgba(238,242,255,0.8)"] {
  background: linear-gradient(90deg, rgba(55,48,163,0.3) 0%, rgba(255,255,255,0) 100%) !important;
}
[data-theme='dark'] .siakad-container [style*="background: #e0e7ff"] {
  background: rgba(67, 56, 202, 0.2) !important;
}
[data-theme='dark'] .siakad-container [style*="background: #4f46e5"] {
  color: white !important;
}
`;
  fs.writeFileSync(cssPath, css + extraCss);
}

console.log('Fixed UI issues!');
