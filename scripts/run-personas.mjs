import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'https://student-profile-9x7c07xvf-jhuynhs-projects-d7adbe9f.vercel.app';
const SAMPLES = path.resolve('samples');

// 3 distinct high school student personas
const PERSONAS = [
  {
    name: 'Mia Chen',
    folder: 'mia-chen-quiet-achiever',
    description: 'Quiet Achiever — introverted, highly conscientious, anxious, loves science',
    // High H(4.2), High E(4.0), Low X(1.8), Moderate A(3.2), Very High C(4.6), Moderate O(3.3)
    scores: [
      // H: high sincerity, high fairness, high greed avoidance, high modesty
      5, 4, 4, 5, 4, 4, 5, 4, 4, 5,
      // E: high fearfulness, high anxiety, high dependence, high sentimentality
      4, 5, 4, 4, 5, 4, 3, 4, 4, 5,
      // X: very low — quiet, shy, reserved
      2, 1, 1, 2, 1, 2, 2, 1, 2, 1,
      // A: moderate — cooperative but not a pushover
      3, 4, 3, 3, 4, 3, 3, 3, 4, 3,
      // C: very high — organised, diligent, perfectionist, prudent
      5, 5, 4, 5, 5, 4, 5, 5, 5, 4,
      // O: moderate — curious about science, less about arts
      3, 4, 3, 3, 4, 3, 3, 3, 4, 3,
      // Learning (Q61-120): strategic studier, high self-regulation, anxious about exams
      4, 5, 3, 4, 5, 4, 3, 5, 4, 3,
      5, 4, 3, 4, 5, 4, 3, 5, 4, 3,
      4, 5, 4, 3, 4, 5, 4, 3, 4, 5,
      3, 4, 5, 4, 3, 4, 5, 3, 4, 5,
      4, 3, 5, 4, 3, 4, 5, 4, 3, 4,
      5, 4, 3, 4, 5, 4, 3, 4, 5, 4,
    ],
  },
  {
    name: 'Jake Morrison',
    folder: 'jake-morrison-social-slacker',
    description: 'Social Butterfly — extraverted, low conscientiousness, creative, easily bored',
    // Low H(2.3), Low E(2.0), Very High X(4.5), Moderate A(3.0), Low C(1.9), High O(4.3)
    scores: [
      // H: low — competitive, status-seeking, strategic
      2, 3, 2, 2, 1, 3, 2, 2, 3, 2,
      // E: low — calm under pressure, emotionally detached
      2, 1, 2, 2, 1, 3, 2, 2, 1, 2,
      // X: very high — bold, sociable, lively, confident
      5, 4, 5, 5, 4, 5, 4, 5, 5, 4,
      // A: moderate — gets along but pushes back
      3, 3, 3, 2, 3, 4, 3, 3, 2, 3,
      // C: low — disorganised, impulsive, hates routine
      2, 1, 2, 2, 1, 2, 2, 1, 2, 2,
      // O: high — creative, curious, unconventional
      4, 5, 4, 5, 4, 4, 5, 4, 4, 5,
      // Learning: surface approach, extrinsically motivated, low grit
      2, 3, 4, 2, 3, 2, 4, 2, 3, 2,
      3, 2, 4, 3, 2, 3, 2, 4, 3, 2,
      2, 3, 2, 4, 3, 2, 3, 2, 4, 3,
      4, 2, 3, 2, 3, 4, 2, 3, 2, 3,
      2, 4, 3, 2, 3, 2, 4, 2, 3, 2,
      3, 2, 4, 3, 2, 3, 2, 4, 3, 2,
    ],
  },
  {
    name: 'Aisha Patel',
    folder: 'aisha-patel-balanced-leader',
    description: 'Balanced Leader — moderate everything, natural coordinator, humanities-strong',
    // Moderate H(3.4), Moderate E(2.8), Moderate-High X(3.6), High A(4.0), Moderate C(3.2), Moderate O(3.5)
    scores: [
      // H: moderate-high — fair, honest, modest
      4, 3, 3, 4, 3, 3, 4, 3, 3, 4,
      // E: moderate-low — steady, not anxious
      3, 2, 3, 3, 2, 3, 3, 3, 2, 3,
      // X: moderate-high — comfortable socially, good presenter
      4, 3, 4, 3, 4, 4, 3, 4, 3, 4,
      // A: high — patient, gentle, forgiving, flexible
      4, 4, 5, 4, 4, 4, 5, 4, 3, 4,
      // C: moderate — organised enough, not perfectionist
      3, 3, 4, 3, 3, 3, 3, 4, 3, 3,
      // O: moderate-high — enjoys literature, open to ideas
      4, 3, 4, 3, 3, 4, 3, 3, 4, 3,
      // Learning: balanced approach, identified motivation, decent self-regulation
      4, 3, 4, 3, 4, 3, 4, 3, 4, 3,
      3, 4, 3, 4, 3, 4, 3, 4, 3, 4,
      4, 3, 4, 3, 4, 3, 4, 3, 4, 3,
      3, 4, 3, 4, 3, 4, 3, 4, 3, 4,
      4, 3, 4, 3, 4, 3, 4, 3, 4, 3,
      3, 4, 3, 4, 3, 4, 3, 4, 3, 4,
    ],
  },
];

async function runPersona(persona) {
  const dir = path.join(SAMPLES, persona.folder);
  fs.mkdirSync(dir, { recursive: true });

  console.log(`\n${'='.repeat(60)}`);
  console.log(`PERSONA: ${persona.name} — ${persona.description}`);
  console.log(`${'='.repeat(60)}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  // Go through the REAL user flow: homepage → fill form → begin → quiz
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Fill in name on homepage
  const nameInput = page.locator('input[placeholder="Full name..."]').first();
  if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await nameInput.fill(persona.name);
    console.log(`  Name entered: ${persona.name}`);
  }

  // Fill email
  const emailInput = page.locator('input[placeholder*="email" i]').first();
  if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await emailInput.fill(`${persona.name.toLowerCase().replace(/\s+/g, '.')}@test.com`);
  }

  // Fill DOB
  const dobInput = page.locator('input[type="date"]').first();
  if (await dobInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await dobInput.fill('2010-05-15');
  }

  // Click Begin Assessment
  const beginBtn = page.locator('button').filter({ hasText: /begin/i }).first();
  if (await beginBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await beginBtn.click();
    await page.waitForTimeout(2000);
  }

  // Answer 120 questions
  let answered = 0;
  for (let attempt = 0; attempt < 300 && answered < 120; attempt++) {
    const score = persona.scores[answered] || 3;
    const btn = page.locator(`button:text-is("${score}")`).first();
    if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.click();
      answered++;
      await page.waitForTimeout(80);
    } else {
      await page.waitForTimeout(2000); // section transition
    }
    if (answered % 60 === 0 && answered > 0) console.log(`  Answered ${answered}/120`);
  }
  console.log(`  Completed: ${answered}/120`);
  await page.waitForTimeout(5000);

  if (errors.length > 0) {
    console.log(`  ERRORS: ${errors.join('; ')}`);
    await browser.close();
    return;
  }

  // Navigate to report if needed
  if (!page.url().includes('/report')) {
    await page.goto(`${BASE}/report`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
  }

  // Report screenshots
  console.log(`  Capturing report...`);
  await page.screenshot({ path: `${dir}/report-top.png` });

  // Section screenshots
  const sections = await page.locator('section').all();
  for (let i = 0; i < sections.length && i < 15; i++) {
    try {
      await sections[i].scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      const title = await sections[i].locator('h2').first().textContent().catch(() => `section-${i}`);
      const safeName = title.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').substring(0, 40);
      await sections[i].screenshot({ path: `${dir}/section-${String(i + 1).padStart(2, '0')}-${safeName}.png` });
    } catch (e) { /* skip */ }
  }

  // Full page
  await page.screenshot({ path: `${dir}/report-full.png`, fullPage: true });

  // Word count
  const bodyText = await page.locator('main').textContent().catch(() => '');
  const wordCount = bodyText.split(/\s+/).length;

  // Download PDF
  const pdfBtn = page.locator('button').filter({ hasText: /pdf|download/i }).first();
  let pdfPages = 0;
  let pdfSize = 0;
  if (await pdfBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }).catch(() => null),
      pdfBtn.click(),
    ]);
    if (download) {
      const pdfPath = `${dir}/${persona.name.replace(/\s+/g, '-')}-report.pdf`;
      await download.saveAs(pdfPath);
      pdfSize = fs.statSync(pdfPath).size;
      const content = fs.readFileSync(pdfPath, 'latin1');
      pdfPages = (content.match(/\/Type\s*\/Page[^s]/g) || []).length;
    }
  }

  console.log(`  Sections: ${sections.length}`);
  console.log(`  Words: ${wordCount}`);
  console.log(`  PDF: ${pdfPages} pages, ${Math.round(pdfSize / 1024)}KB`);
  console.log(`  Errors: ${errors.length}`);
  console.log(`  Saved to: ${dir}/`);

  await browser.close();
  return { name: persona.name, sections: sections.length, words: wordCount, pdfPages, errors: errors.length };
}

async function main() {
  console.log('Running 3 high school student personas against production site...\n');

  const results = [];
  for (const persona of PERSONAS) {
    const result = await runPersona(persona);
    if (result) results.push(result);
  }

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log('| Persona | Sections | Words | PDF Pages | Errors |');
  console.log('|---------|----------|-------|-----------|--------|');
  for (const r of results) {
    console.log(`| ${r.name.padEnd(15)} | ${String(r.sections).padEnd(8)} | ${String(r.words).padEnd(5)} | ${String(r.pdfPages).padEnd(9)} | ${r.errors} |`);
  }
  console.log('\nAll samples saved to samples/');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
