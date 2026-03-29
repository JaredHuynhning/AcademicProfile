import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // Go to test page directly
  await page.goto(`${BASE}/test`);
  await page.waitForTimeout(1500);
  console.log('Test page loaded');

  // Fill in name if input visible
  const nameInput = page.locator('input[type="text"]').first();
  if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await nameInput.fill('Sophie Chen');
    const nextBtn = page.locator('button').filter({ hasText: /begin|start|next/i }).first();
    if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextBtn.click();
    }
  }
  await page.waitForTimeout(1000);

  // Answer all 120 questions with varied scores
  const scores = [5, 4, 3, 2, 1, 4, 3, 5, 2, 4];
  for (let q = 0; q < 120; q++) {
    const scoreVal = scores[q % scores.length];
    // Wait for Likert buttons — section interstitials auto-dismiss after 1.5s
    const btn = page.locator(`button:text-is("${scoreVal}")`).first();
    if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(100);
    } else {
      // Section transition — wait for it to auto-dismiss
      console.log(`Q${q + 1}: waiting for section transition...`);
      await page.waitForTimeout(2000);
      q--; // retry this question
    }
    if (q % 30 === 0) console.log(`Answered ${q + 1}/120`);
  }

  console.log('Assessment complete, navigating to report...');
  await page.waitForTimeout(2000);

  // Navigate to report
  if (!page.url().includes('/report')) {
    const reportLink = page.locator('a[href="/report"]').first();
    if (await reportLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await reportLink.click();
    } else {
      await page.goto(`${BASE}/report`);
    }
  }
  await page.waitForTimeout(3000);

  // Count sections and headings
  const sections = await page.locator('section').count();
  const h2s = await page.locator('h2').allTextContents();
  const h3s = await page.locator('h3').allTextContents();

  console.log(`\n=== REPORT VERIFICATION ===`);
  console.log(`URL: ${page.url()}`);
  console.log(`Sections: ${sections}`);
  console.log(`h2 headings (${h2s.length}):`, h2s);
  console.log(`h3 subheadings: ${h3s.length}`);
  if (h3s.length > 0) console.log('First 10:', h3s.slice(0, 10));

  // Check for research notes and bold text
  const strongTags = await page.locator('strong').count();
  console.log(`Bold elements: ${strongTags}`);

  // Get approximate content length
  const bodyText = await page.locator('main').textContent();
  const wordCount = bodyText?.split(/\s+/).length || 0;
  console.log(`Approximate word count: ${wordCount}`);
  console.log(`Estimated pages (at 300 words/page): ${Math.round(wordCount / 300)}`);

  await browser.close();
  console.log('\nDone!');
}

run().catch(e => { console.error(e); process.exit(1); });
