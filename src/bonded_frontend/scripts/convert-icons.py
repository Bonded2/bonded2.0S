#!/usr/bin/env python3

# ANCHOR: SVG to PNG Icon Converter
# This script converts SVG icons to PNG format for PWA

import os
import sys
from pathlib import Path

def create_png_from_svg():
    """Create PNG icons from SVG using a simple approach"""
    
    # NOTE: Icon sizes required for PWA
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    # Get the current directory
    script_dir = Path(__file__).parent
    icons_dir = script_dir.parent / 'public' / 'icons'
    
    print("🎨 Converting SVG icons to PNG...")
    
    # Create a simple HTML file that can be used to convert SVG to PNG
    html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SVG to PNG Converter</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #F2F1FF;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .icon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        .icon-item {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .icon-item img {
            max-width: 100px;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .download-btn {
            background: #697DFF;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
            font-size: 14px;
        }
        .download-btn:hover {
            background: #5365CD;
        }
        .instructions {
            background: #E2E9FF;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎨 PWA Icon Converter</h1>
        <p>Convert SVG icons to PNG format for your PWA</p>
    </div>
    
    <div class="instructions">
        <h3>📋 Instructions:</h3>
        <ol>
            <li>Click the "Download PNG" button for each icon size</li>
            <li>Save the files to the <code>/public/icons/</code> directory</li>
            <li>Make sure the filename matches the pattern: <code>icon-{size}x{size}.png</code></li>
        </ol>
    </div>

    <div class="icon-grid" id="iconGrid">
        <!-- Icons will be generated here -->
    </div>

    <script>
        // ANCHOR: Icon sizes
        const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
        const iconGrid = document.getElementById('iconGrid');

        // ANCHOR: Create icon for each size
        sizes.forEach(size => {
            const iconItem = document.createElement('div');
            iconItem.className = 'icon-item';
            
            // Create SVG content
            const svgContent = `
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="gradient-${size}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#697DFF;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#5365CD;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <rect width="${size}" height="${size}" rx="${size * 0.2}" ry="${size * 0.2}" fill="url(#gradient-${size})"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.6}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#FFFFFF">B</text>
                </svg>
            `;
            
            // Create blob URL for SVG
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const svgUrl = URL.createObjectURL(blob);
            
            // Create image element
            const img = document.createElement('img');
            img.src = svgUrl;
            img.alt = `${size}x${size} icon`;
            img.style.maxWidth = '100px';
            img.style.height = 'auto';
            
            // Create label
            const label = document.createElement('div');
            label.textContent = `${size}x${size}`;
            label.style.margin = '10px 0';
            label.style.fontWeight = 'bold';
            
            // Create download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.textContent = 'Download PNG';
            downloadBtn.onclick = () => downloadAsPNG(svgContent, size);
            
            // Assemble the item
            iconItem.appendChild(img);
            iconItem.appendChild(label);
            iconItem.appendChild(downloadBtn);
            iconGrid.appendChild(iconItem);
        });

        // ANCHOR: Download as PNG function
        function downloadAsPNG(svgContent, size) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            canvas.width = size;
            canvas.height = size;
            
            img.onload = function() {
                ctx.drawImage(img, 0, 0, size, size);
                
                canvas.toBlob(function(blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `icon-${size}x${size}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 'image/png');
            };
            
            const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
            const svgUrl = URL.createObjectURL(svgBlob);
            img.src = svgUrl;
        }
    </script>
</body>
</html>'''
    
    # Write the HTML file
    converter_file = icons_dir / 'svg-to-png-converter.html'
    with open(converter_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✅ Created SVG to PNG converter: {converter_file}")
    print(f"🌐 Open the file in your browser to convert icons to PNG format")
    print(f"📁 Icons directory: {icons_dir}")
    
    return True

if __name__ == "__main__":
    try:
        create_png_from_svg()
        print("\n🎉 Icon conversion setup complete!")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
