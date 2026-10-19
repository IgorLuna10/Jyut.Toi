import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Deterministic Pseudo-Random Number Generator (Mulberry32)
function createPrng(seedStr) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
  }
  return function () {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Convert hex to RGB array
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  if (clean.length === 3) {
    const r = (bigint >> 8) & 0xf;
    const g = (bigint >> 4) & 0xf;
    const b = bigint & 0xf;
    return [(r << 4) | r, (g << 4) | g, (b << 4) | b];
  }
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// Blend two hex colors
function blendColor(c1, c2, ratio) {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
}

// Generate SVG tile wall
function generateTileWallSvg(themeId, themeConfig, mode, width = 480, height = 720) {
  const prng = createPrng(`${themeId}-${mode}-seed-v1`);
  const modeConfig = themeConfig[mode];
  const { tileType } = themeConfig;
  const { tileBase, tileGrout, tileHighlight, wallGradient } = modeConfig;

  const tileSize = 24;
  const groutSize = 2;
  const totalCell = tileSize + groutSize;

  const cols = Math.ceil(width / totalCell);
  const rows = Math.ceil(height / totalCell);

  let svgElements = [];

  // Gradient background definition
  const defs = `
    <defs>
      <linearGradient id="wall-grad-${themeId}-${mode}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${wallGradient[0]}" />
        <stop offset="100%" stop-color="${wallGradient[1]}" />
      </linearGradient>
      <linearGradient id="tile-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
        <stop offset="70%" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.22" />
      </linearGradient>
      <linearGradient id="tile-glaze" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
        <stop offset="35%" stop-color="#ffffff" stop-opacity="0.05" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.15" />
      </linearGradient>
    </defs>
  `;

  // Base background (grout / wall)
  svgElements.push(
    `<rect width="${width}" height="${height}" fill="${tileGrout}" />`
  );

  // If gloss panel (Level 8 / lilac), render enamel metal panel with seams rather than small mosaic tiles
  if (tileType === 'gloss_panel') {
    svgElements.push(
      `<rect width="${width}" height="${height}" fill="url(#wall-grad-${themeId}-${mode})" />`
    );
    // Subtle horizontal glossy panels
    const panelHeight = 120;
    for (let y = 0; y < height; y += panelHeight) {
      svgElements.push(
        `<rect x="0" y="${y}" width="${width}" height="${panelHeight - 3}" fill="${tileBase}" opacity="0.9" />`
      );
      // Specular gloss reflection strip
      svgElements.push(
        `<line x1="0" y1="${y + 2}" x2="${width}" y2="${y + 2}" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.5" />`
      );
      svgElements.push(
        `<line x1="0" y1="${y + panelHeight - 3}" x2="${width}" y2="${y + panelHeight - 3}" stroke="#000000" stroke-opacity="0.2" stroke-width="1" />`
      );
    }
  } else {
    // Generate individual mosaic tiles
    for (let r = 0; r < rows; r++) {
      const y = r * totalCell;
      const verticalRatio = r / rows;

      for (let c = 0; c < cols; c++) {
        const x = c * totalCell;
        let cellBase = tileBase;

        // Customizations per tile type
        if (tileType === 'gradient_mosaic') {
          // Teal gradient fading darker towards the bottom
          const [r1, g1, b1] = hexToRgb(wallGradient[0]);
          const [r2, g2, b2] = hexToRgb(wallGradient[1]);
          const cr = Math.round(r1 + (r2 - r1) * verticalRatio);
          const cg = Math.round(g1 + (g2 - g1) * verticalRatio);
          const cb = Math.round(b1 + (b2 - b1) * verticalRatio);
          cellBase = `rgb(${cr}, ${cg}, ${cb})`;
        } else if (tileType === 'speckled_mosaic') {
          // Charcoal with scattered white specks
          if (prng() < modeConfig.speckRatio) {
            cellBase = modeConfig.speckColor;
          }
        } else if (tileType === 'flecked_mosaic') {
          // Brick with pale/pink flecks
          if (prng() < modeConfig.speckRatio) {
            cellBase = modeConfig.speckColor;
          }
        } else if (tileType === 'twotone_mosaic') {
          // Checkerboard two-tone
          cellBase = (r + c) % 2 === 0 ? modeConfig.tileBase : modeConfig.tileSecondary;
        }

        // Slight micro-variation in tile tone for authentic handmade glass mosaic look
        const jitter = (prng() - 0.5) * 0.14;
        const opacity = (0.92 + jitter).toFixed(3);

        svgElements.push(
          `<g transform="translate(${x}, ${y})">
            <rect width="${tileSize}" height="${tileSize}" rx="2" fill="${cellBase}" opacity="${opacity}" />
            <rect width="${tileSize}" height="${tileSize}" rx="2" fill="url(#tile-glaze)" />
            <rect width="${tileSize}" height="${tileSize}" rx="2" fill="url(#tile-bevel)" />
          </g>`
        );
      }
    }
  }

  // Lighter upper third ambient station illumination
  svgElements.push(
    `<rect width="${width}" height="${Math.round(height * 0.38)}" fill="url(#wall-grad-${themeId}-${mode})" opacity="0.12" />`
  );

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${defs}
      ${svgElements.join('\n')}
    </svg>
  `;
}

// Main runner
async function buildAllTiles() {
  const themesPath = path.resolve(__dirname, '../shared/themes.json');
  const themesRaw = fs.readFileSync(themesPath, 'utf8');
  const themesData = JSON.parse(themesRaw);

  const sharedTilesDir = path.resolve(__dirname, '../shared/tiles');
  const publicTilesDir = path.resolve(__dirname, '../public/tiles');

  [sharedTilesDir, publicTilesDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const report = [];

  for (const [themeId, themeConfig] of Object.entries(themesData.themes)) {
    for (const mode of ['light', 'night']) {
      const filename = `${themeId}_${mode}.webp`;
      const svg = generateTileWallSvg(themeId, themeConfig, mode);

      // Render to WebP with sharp
      const webpBuffer = await sharp(Buffer.from(svg))
        .webp({ quality: 85, effort: 4 })
        .toBuffer();

      const sizeKb = (webpBuffer.length / 1024).toFixed(1);

      // Save to shared/tiles and public/tiles
      const sharedOut = path.join(sharedTilesDir, filename);
      const publicOut = path.join(publicTilesDir, filename);
      fs.writeFileSync(sharedOut, webpBuffer);
      fs.writeFileSync(publicOut, webpBuffer);

      // Also save SVG for resolution-independent vector rendering
      const svgFilename = `${themeId}_${mode}.svg`;
      fs.writeFileSync(path.join(sharedTilesDir, svgFilename), svg);
      fs.writeFileSync(path.join(publicTilesDir, svgFilename), svg);

      report.push({ themeId, mode, filename, sizeKb });
      if (webpBuffer.length > 80 * 1024) {
        throw new Error(`Asset ${filename} exceeds 80 KB limit: ${sizeKb} KB`);
      }
    }
  }

  console.log(`\n Generated ${report.length} tile textures deterministically:`);
  console.table(report);
  console.log(' All tile assets verified < 80 KB.');
}

buildAllTiles().catch((err) => {
  console.error('Error generating tiles:', err);
  process.exit(1);
});
