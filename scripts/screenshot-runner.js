import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: '375x667', width: 375, height: 667 },
  { name: '393x852', width: 393, height: 852 },
  { name: '430x932', width: 430, height: 932 },
];

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUTPUT_DIR = '/tmp/screenshots';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      });

      // 1. Capture Main Route Map Screen
      await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(OUTPUT_DIR, `new-route-${vp.name}.png`) });
      console.log(`Saved new-route-${vp.name}.png`);

      // 2. Click Start button on the level card to enter Exercise
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const startBtn = btns.find(b => b.textContent.trim().includes('Start') || b.textContent.trim().includes('Review'));
        if (startBtn) startBtn.click();
      });

      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(OUTPUT_DIR, `new-exercise-${vp.name}.png`) });
      console.log(`Saved new-exercise-${vp.name}.png`);

      // 3. Select an answer card and submit to test feedback sheet
      await page.evaluate(() => {
        const optionCards = Array.from(document.querySelectorAll('.answer-card'));
        if (optionCards.length > 0) {
          optionCards[0].click();
        }
      });
      await new Promise(r => setTimeout(r, 300));
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const checkBtn = btns.find(b => b.textContent.trim().includes('Check Answer'));
        if (checkBtn) checkBtn.click();
      });
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(OUTPUT_DIR, `new-feedback-${vp.name}.png`) });
      console.log(`Saved new-feedback-${vp.name}.png`);

      await page.close();
    }
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
