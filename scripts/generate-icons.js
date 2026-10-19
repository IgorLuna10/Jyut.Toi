import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SVG_SOURCE = path.join(rootDir, 'assets', 'jyut-toi-icon.svg');
const BG_DARK = '#07090E';
const BG_MORTAR = '#36080B';

async function generate() {
  console.log('Generating Jyut.Toi icons from:', SVG_SOURCE);
  
  if (!fs.existsSync(SVG_SOURCE)) {
    throw new Error(`SVG source not found at ${SVG_SOURCE}`);
  }

  // 1. Render master 1024x1024 PNG from SVG
  const masterBuffer = await sharp(SVG_SOURCE)
    .resize(1024, 1024)
    .png()
    .toBuffer();

  // Helper to safely write file ensuring directory exists
  const writeImage = async (buffer, targetPath) => {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    await fs.promises.writeFile(targetPath, buffer);
  };

  // 2. Primary Assets in assets/
  console.log('Generating primary assets in assets/...');
  await writeImage(masterBuffer, path.join(rootDir, 'assets', 'icon.png'));
  await writeImage(masterBuffer, path.join(rootDir, 'assets', 'adaptive-icon.png'));
  await writeImage(masterBuffer, path.join(rootDir, 'assets', 'splash-icon.png'));
  
  const faviconBuffer = await sharp(masterBuffer).resize(192, 192).png().toBuffer();
  await writeImage(faviconBuffer, path.join(rootDir, 'assets', 'favicon.png'));

  // 3. Web Assets in public/
  console.log('Updating web public/ icons...');
  await writeImage(masterBuffer, path.join(rootDir, 'public', 'icon.png'));
  await writeImage(faviconBuffer, path.join(rootDir, 'public', 'favicon.png'));

  // 4. iOS App Icon
  console.log('Updating iOS AppIcon...');
  const iosIconPath = path.join(rootDir, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset', 'AppIcon-512@2x.png');
  await writeImage(masterBuffer, iosIconPath);

  // 5. iOS Splash Screen (2732x2732 with centered mosaic icon)
  console.log('Updating iOS Splash screens...');
  const iosSplashSize = 2732;
  const iosIconSplashSize = 800;
  const iosSplashIconBuffer = await sharp(masterBuffer)
    .resize(iosIconSplashSize, iosIconSplashSize)
    .png()
    .toBuffer();

  const iosSplashBuffer = await sharp({
    create: {
      width: iosSplashSize,
      height: iosSplashSize,
      channels: 4,
      background: BG_DARK
    }
  })
    .composite([
      {
        input: iosSplashIconBuffer,
        top: Math.round((iosSplashSize - iosIconSplashSize) / 2),
        left: Math.round((iosSplashSize - iosIconSplashSize) / 2)
      }
    ])
    .png()
    .toBuffer();

  const iosSplashDir = path.join(rootDir, 'ios', 'App', 'App', 'Assets.xcassets', 'Splash.imageset');
  if (fs.existsSync(iosSplashDir)) {
    await writeImage(iosSplashBuffer, path.join(iosSplashDir, 'splash-2732x2732.png'));
    await writeImage(iosSplashBuffer, path.join(iosSplashDir, 'splash-2732x2732-1.png'));
    await writeImage(iosSplashBuffer, path.join(iosSplashDir, 'splash-2732x2732-2.png'));
  }

  // 6. Android Mipmap Icons
  console.log('Updating Android mipmap icons...');
  const androidDensities = [
    { name: 'mipmap-mdpi', size: 48, fgSize: 108 },
    { name: 'mipmap-hdpi', size: 72, fgSize: 162 },
    { name: 'mipmap-xhdpi', size: 96, fgSize: 216 },
    { name: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
    { name: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
  ];

  for (const { name, size, fgSize } of androidDensities) {
    const dir = path.join(rootDir, 'android', 'app', 'src', 'main', 'res', name);
    if (!fs.existsSync(dir)) continue;

    // Standard square launcher
    const launcherBuffer = await sharp(masterBuffer).resize(size, size).png().toBuffer();
    await writeImage(launcherBuffer, path.join(dir, 'ic_launcher.png'));

    // Round launcher (circular mask)
    const circleMask = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#000"/></svg>`
    );
    const roundBuffer = await sharp(launcherBuffer)
      .composite([{ input: circleMask, blend: 'dest-in' }])
      .png()
      .toBuffer();
    await writeImage(roundBuffer, path.join(dir, 'ic_launcher_round.png'));

    // Adaptive icon foreground: safe area is center ~66% of fgSize
    const safeZoneSize = Math.round(fgSize * 0.66);
    const scaledCenter = await sharp(masterBuffer).resize(safeZoneSize, safeZoneSize).png().toBuffer();
    const fgBuffer = await sharp({
      create: {
        width: fgSize,
        height: fgSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([
        {
          input: scaledCenter,
          top: Math.round((fgSize - safeZoneSize) / 2),
          left: Math.round((fgSize - safeZoneSize) / 2)
        }
      ])
      .png()
      .toBuffer();
    await writeImage(fgBuffer, path.join(dir, 'ic_launcher_foreground.png'));
  }

  // Ensure Android background matches Tsuen Wan mortar
  const bgXmlPath = path.join(rootDir, 'android', 'app', 'src', 'main', 'res', 'values', 'ic_launcher_background.xml');
  if (fs.existsSync(bgXmlPath)) {
    const bgXmlContent = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${BG_MORTAR}</color>\n</resources>\n`;
    await fs.promises.writeFile(bgXmlPath, bgXmlContent, 'utf8');
  }

  // 7. Android Splash Screens
  console.log('Updating Android splash drawables...');
  const androidSplashList = [
    { dir: 'drawable', w: 480, h: 320 },
    { dir: 'drawable-port-mdpi', w: 320, h: 480 },
    { dir: 'drawable-port-hdpi', w: 480, h: 800 },
    { dir: 'drawable-port-xhdpi', w: 720, h: 1280 },
    { dir: 'drawable-port-xxhdpi', w: 960, h: 1600 },
    { dir: 'drawable-port-xxxhdpi', w: 1280, h: 1920 },
    { dir: 'drawable-land-mdpi', w: 480, h: 320 },
    { dir: 'drawable-land-hdpi', w: 800, h: 480 },
    { dir: 'drawable-land-xhdpi', w: 1280, h: 720 },
    { dir: 'drawable-land-xxhdpi', w: 1600, h: 960 },
    { dir: 'drawable-land-xxxhdpi', w: 1920, h: 1280 },
  ];

  for (const { dir, w, h } of androidSplashList) {
    const targetDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'res', dir);
    if (!fs.existsSync(targetDir)) continue;

    const iconSize = Math.min(Math.round(Math.min(w, h) * 0.45), 512);
    const scaledIcon = await sharp(masterBuffer).resize(iconSize, iconSize).png().toBuffer();
    const splashBuffer = await sharp({
      create: {
        width: w,
        height: h,
        channels: 4,
        background: BG_DARK
      }
    })
      .composite([
        {
          input: scaledIcon,
          top: Math.round((h - iconSize) / 2),
          left: Math.round((w - iconSize) / 2)
        }
      ])
      .png()
      .toBuffer();
    await writeImage(splashBuffer, path.join(targetDir, 'splash.png'));
  }

  console.log(' All Jyut.Toi icons and splash assets successfully generated!');
}

generate().catch(err => {
  console.error('Failed generating icons:', err);
  process.exit(1);
});
