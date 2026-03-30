import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'https://student-profile-9x7c07xvf-jhuynhs-projects-d7adbe9f.vercel.app';
const SCREENSHOTS = path.resolve('screenshots');

async function run() {
  console.log('=== E2E Report Test ===');
  console.log('Target:', BASE);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`);
  });

  // ─── Step 1: Landing page ──────────────────────────────────────────────────
  console.log('\n1. Loading landing page...');
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${SCREENSHOTS}/01-landing.png`, fullPage: true });
  console.log('   Screenshot: 01-landing.png');

  // ─── Step 2: Navigate to test ──────────────────────────────────────────────
  console.log('\n2. Navigating to assessment...');
  await page.goto(`${BASE}/test`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${SCREENSHOTS}/02-test-start.png` });
  console.log('   Screenshot: 02-test-start.png');

  // ─── Step 3: Complete the quiz ─────────────────────────────────────────────
  console.log('\n3. Completing 120-question assessment...');

  // Varied scores to produce an interesting, non-flat profile
  // High C(4.2), High O(4.0), Low X(2.0), Moderate E(3.1), High A(3.7), High H(4.1)
  const scorePattern = [
    // H facets (Q1-10): high
    5, 4, 4, 5, 4, 3, 4, 5, 4, 4,
    // E facets (Q11-20): moderate
    3, 4, 2, 3, 4, 3, 2, 4, 3, 3,
    // X facets (Q21-30): low
    2, 1, 2, 3, 1, 2, 2, 3, 2, 1,
    // A facets (Q31-40): moderate-high
    4, 3, 4, 4, 3, 4, 5, 3, 4, 4,
    // C facets (Q41-50): high
    5, 4, 5, 4, 4, 5, 4, 5, 4, 5,
    // O facets (Q51-60): high
    4, 5, 4, 4, 5, 3, 4, 5, 4, 4,
    // Learning questions (Q61-120): varied
    4, 3, 5, 2, 4, 3, 4, 5, 3, 4,
    3, 4, 2, 5, 4, 3, 4, 3, 5, 4,
    4, 3, 4, 5, 3, 2, 4, 3, 4, 5,
    3, 4, 5, 3, 4, 2, 4, 3, 5, 4,
    4, 3, 4, 5, 3, 4, 2, 5, 3, 4,
    3, 4, 5, 4, 3, 4, 5, 3, 4, 4,
  ];

  let answered = 0;
  let sectionScreenshots = 0;
  for (let attempt = 0; attempt < 300 && answered < 120; attempt++) {
    const score = scorePattern[answered] || 3;
    const btn = page.locator(`button:text-is("${score}")`).first();
    if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.click();
      answered++;
      await page.waitForTimeout(100);

      // Screenshot at key milestones
      if (answered === 1) {
        await page.screenshot({ path: `${SCREENSHOTS}/03-first-question.png` });
        console.log('   Screenshot: 03-first-question.png');
      }
      if (answered === 60) {
        await page.screenshot({ path: `${SCREENSHOTS}/04-halfway.png` });
        console.log('   Screenshot: 04-halfway.png (60/120)');
      }
      if (answered === 119) {
        await page.screenshot({ path: `${SCREENSHOTS}/05-almost-done.png` });
        console.log('   Screenshot: 05-almost-done.png (119/120)');
      }
    } else {
      // Section transition — wait for auto-dismiss
      if (sectionScreenshots < 2) {
        await page.screenshot({ path: `${SCREENSHOTS}/03b-section-transition-${sectionScreenshots + 1}.png` });
        sectionScreenshots++;
      }
      await page.waitForTimeout(2000);
    }

    if (answered % 30 === 0 && answered > 0) console.log(`   Answered ${answered}/120`);
  }
  console.log(`   Total answered: ${answered}`);

  // Wait for redirect to report
  await page.waitForTimeout(5000);
  console.log('   Current URL:', page.url());

  // ─── Step 4: Navigate to report ────────────────────────────────────────────
  if (!page.url().includes('/report')) {
    console.log('\n4. Navigating to report page...');
    await page.goto(`${BASE}/report`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
  }

  if (errors.length > 0) {
    console.log('\n⚠️  ERRORS DETECTED:');
    errors.forEach(e => console.log('   ', e));
  }

  // ─── Step 5: Report overview ───────────────────────────────────────────────
  console.log('\n5. Capturing report...');
  await page.screenshot({ path: `${SCREENSHOTS}/06-report-top.png` });
  console.log('   Screenshot: 06-report-top.png');

  // Get section count and titles
  const h2s = await page.locator('h2').allTextContents();
  console.log(`   Sections found: ${h2s.length}`);
  h2s.forEach((h, i) => console.log(`     ${i + 1}. ${h}`));

  // Word count
  const bodyText = await page.locator('main').textContent().catch(() => '');
  const wordCount = bodyText.split(/\s+/).length;
  console.log(`   Total word count: ${wordCount}`);

  // ─── Step 6: Screenshot each section ───────────────────────────────────────
  console.log('\n6. Capturing individual sections...');

  const sections = await page.locator('section').all();
  for (let i = 0; i < sections.length && i < 15; i++) {
    try {
      await sections[i].scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      const title = await sections[i].locator('h2').first().textContent().catch(() => `section-${i}`);
      const safeName = title.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').substring(0, 40);
      await sections[i].screenshot({ path: `${SCREENSHOTS}/07-section-${String(i + 1).padStart(2, '0')}-${safeName}.png` });
      console.log(`   Screenshot: 07-section-${String(i + 1).padStart(2, '0')}-${safeName}.png`);
    } catch (e) {
      console.log(`   Failed to capture section ${i}: ${e.message}`);
    }
  }

  // Full page screenshot
  console.log('\n7. Full-page screenshot...');
  await page.screenshot({ path: `${SCREENSHOTS}/08-report-full.png`, fullPage: true });
  console.log('   Screenshot: 08-report-full.png');

  // ─── Step 7: Test PDF download ─────────────────────────────────────────────
  console.log('\n8. Testing PDF download...');
  const pdfBtn = page.locator('button').filter({ hasText: /pdf|download/i }).first();
  if (await pdfBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }).catch(() => null),
      pdfBtn.click(),
    ]);
    if (download) {
      const pdfPath = `${SCREENSHOTS}/sample-report.pdf`;
      await download.saveAs(pdfPath);
      const size = fs.statSync(pdfPath).size;
      const content = fs.readFileSync(pdfPath, 'latin1');
      const pages = (content.match(/\/Type\s*\/Page[^s]/g) || []).length;
      console.log(`   PDF saved: sample-report.pdf (${Math.round(size / 1024)}KB, ${pages} pages)`);
    } else {
      console.log('   No download event — PDF may have errored');
    }
  } else {
    console.log('   No PDF button found');
  }

  // ─── Summary ───────────────────────────────────────────────────────────────
  console.log('\n=== RESULTS ===');
  console.log(`Questions answered: ${answered}/120`);
  console.log(`Report sections: ${h2s.length}`);
  console.log(`Word count: ${wordCount}`);
  console.log(`Runtime errors: ${errors.length}`);
  if (errors.length > 0) errors.forEach(e => console.log(`  ERROR: ${e}`));
  console.log(`Screenshots saved to: ${SCREENSHOTS}/`);

  await browser.close();
  console.log('\nDone!');
}

run().catch(e => { console.error('FATAL:', e); process.exit(1); });
