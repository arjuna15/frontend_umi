const fs = require('fs');
const file = 'src/app/page.js';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import Image from 'next/image';")) {
  content = content.replace('"use client";', '"use client";\nimport Image from \'next/image\';');
}

// Replace <img src="..." alt="..." /> with <Image src="..." alt="..." width={800} height={600} style={{ width: '100%', height: 'auto' }} unoptimized={true} />
// We use unoptimized={true} for now to guarantee it works without blowing up layout, while still giving next/image benefits, but wait, next/image without optimization doesn't give much LCP benefit. Let's just use standard next/image with width/height to avoid layout shifts.

content = content.replace(/<img([^>]*)src=(['"])(.*?)\2([^>]*)>/g, (match, before, quote, src, after) => {
  // If it already has style, we should probably append to it, or just use fill.
  // Actually, Next.js Image with width={800} height={600} and style={{width: '100%', height: 'auto'}} is the standard way to replace responsive images.
  let newImg = `<Image${before}src="${src}"${after} width={800} height={600} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />`;
  // Clean up duplicate styles or messy attributes if needed, but this regex is simple.
  // Since page.js has hardcoded styles inside <img style={{...}}>, it's safer to just replace `<img ` with `<Image width={800} height={600} `.
  return match;
});

// Actually, doing this via regex might break React's JSX syntax if style={{}} is duplicated. 
