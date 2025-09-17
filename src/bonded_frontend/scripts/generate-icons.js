#!/usr/bin/env node

// ANCHOR: PWA Icon Generator Script
// This script generates PWA icons in all required sizes

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// NOTE: Icon sizes required for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// ANCHOR: Create SVG icon template
function createSVGIcon(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#697DFF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#5365CD;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" ry="${size * 0.2}" fill="url(#gradient)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.6}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#FFFFFF">B</text>
</svg>`;
}

// ANCHOR: Generate icons
function generateIcons() {
  const iconsDir = path.join(__dirname, '../public/icons');
  
  // Create icons directory if it doesn't exist
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  console.log('🎨 Generating PWA icons...');
  
  sizes.forEach(size => {
    const svgContent = createSVGIcon(size);
    const filename = `icon-${size}x${size}.svg`;
    const filepath = path.join(iconsDir, filename);
    
    fs.writeFileSync(filepath, svgContent);
    console.log(`✅ Generated ${filename}`);
  });

  // ANCHOR: Create a simple HTML file for manual PNG conversion
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Convert SVG to PNG</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #F2F1FF; }
        .icon-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .icon-item { text-align: center; background: white; padding: 15px; border-radius: 8px; }
        .icon-item img { max-width: 100px; height: auto; }
        .download-btn { background: #697DFF; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin: 5px; }
    </style>
</head>
<body>
    <h1>PWA Icon Converter</h1>
    <p>Right-click on each icon and "Save image as..." to download as PNG files.</p>
    <div class="icon-grid" id="iconGrid"></div>
    
    <script>
        const sizes = [${sizes.join(', ')}];
        const iconGrid = document.getElementById('iconGrid');
        
        sizes.forEach(size => {
            const div = document.createElement('div');
            div.className = 'icon-item';
            div.innerHTML = \`
                <img src="icon-\${size}x\${size}.svg" alt="\${size}x\${size}">
                <div>\${size}x\${size}</div>
                <button class="download-btn" onclick="downloadIcon(\${size})">Download PNG</button>
            \`;
            iconGrid.appendChild(div);
        });
        
        function downloadIcon(size) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = function() {
                canvas.width = size;
                canvas.height = size;
                ctx.drawImage(img, 0, 0, size, size);
                
                const link = document.createElement('a');
                link.download = \`icon-\${size}x\${size}.png\`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            };
            
            img.src = \`icon-\${size}x\${size}.svg\`;
        }
    </script>
</body>
</html>`;

  const converterPath = path.join(iconsDir, 'convert-to-png.html');
  fs.writeFileSync(converterPath, htmlContent);
  console.log('✅ Generated convert-to-png.html');
  
  console.log('\n🎉 Icon generation complete!');
  console.log('📁 Icons saved to:', iconsDir);
  console.log('🌐 Open convert-to-png.html in your browser to convert SVG to PNG');
}

// ANCHOR: Run the script
generateIcons();

export { generateIcons, createSVGIcon };
