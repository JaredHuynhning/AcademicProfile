import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "screenshots");

const quizState = {
  state: {
    answers: {},
    currentIndex: 0,
    name: "Sophie Turner",
    email: "sophie@example.com",
    dob: "2010-06-15",
    quizMode: "complete",
    results: {
      dimensions: [
        { name: "H", score: 4.8, facets: [
          { name: "Sincerity", score: 5 }, { name: "Fairness", score: 5 },
          { name: "Greed Avoidance", score: 4 }, { name: "Modesty", score: 5 },
        ]},
        { name: "E", score: 2.9, facets: [
          { name: "Fearfulness", score: 2.67 }, { name: "Anxiety", score: 3 },
          { name: "Dependence", score: 3 }, { name: "Sentimentality", score: 3 },
        ]},
        { name: "X", score: 3.7, facets: [
          { name: "Social Self-Esteem", score: 4.67 }, { name: "Social Boldness", score: 3 },
          { name: "Sociability", score: 3 }, { name: "Liveliness", score: 4 },
        ]},
        { name: "A", score: 4.1, facets: [
          { name: "Forgiveness", score: 4 }, { name: "Gentleness", score: 4 },
          { name: "Flexibility", score: 4 }, { name: "Patience", score: 4.5 },
        ]},
        { name: "C", score: 4.9, facets: [
          { name: "Organisation", score: 5 }, { name: "Diligence", score: 5 },
          { name: "Perfectionism", score: 4.67 }, { name: "Prudence", score: 5 },
        ]},
        { name: "O", score: 4.3, facets: [
          { name: "Aesthetic Appreciation", score: 4 }, { name: "Inquisitiveness", score: 4.5 },
          { name: "Creativity", score: 4.33 }, { name: "Unconventionality", score: 4.33 },
        ]},
      ],
      studyProfile: {
        studyApproaches: {
          deep: { score: 4.3, level: "high", items: 4 },
          strategic: { score: 4.7, level: "high", items: 3 },
          surface: { score: 1, level: "low", items: 3 },
        },
        motivation: {
          intrinsic: { score: 4.3, level: "high", items: 3 },
          identified: { score: 5, level: "high", items: 2 },
          external: { score: 2, level: "low", items: 2 },
          amotivation: { score: 1, level: "low", items: 3 },
          sdi: 9.6,
        },
        selfRegulation: {
          selfEfficacy: { score: 4.5, level: "high", items: 2 },
          planning: { score: 4.5, level: "high", items: 2 },
          effortRegulation: { score: 4.5, level: "high", items: 2 },
          testAnxiety: { score: 3.5, level: "high", items: 2 },
          helpSeeking: { score: 4, level: "high", items: 2 },
        },
        dominantApproach: "strategic",
        motivationProfile: "self-determined",
        regulationStrength: "high",
      },
      learnerProfile: {
        grit: {
          perseverance: { score: 4.7, level: "high", items: 3 },
          consistency: { score: 4.3, level: "high", items: 3 },
          overall: { score: 4.5, level: "high" },
        },
        focus: {
          concentration: { score: 4, level: "high", items: 3 },
          procrastination: { score: 4.7, level: "high", items: 3 },
        },
        energy: {
          vitality: { score: 4, level: "high", items: 2 },
          depletion: { score: 4, level: "high", items: 2 },
          netEnergy: { score: 4, level: "high" },
        },
        subjectFit: {
          maths: { passion: 4, confidence: 5, alignment: "aligned" },
          english: { passion: 4, confidence: 4, alignment: "aligned" },
          science: { passion: 5, confidence: 5, alignment: "aligned" },
        },
        teacherPreference: {
          structure: 4, warmth: 4, profile: "warm-structured",
          carrot: 4, stick: 3, responseType: "encouragement",
        },
        examBarriers: {
          preparation: 4, external: 1, anxiety: 2,
          timeManagement: 2, primaryBarrier: "none",
        },
      },
      quizMode: "complete",
    },
  },
  version: 0,
};

const screenshots = [
  { id: "section-cover", file: "report-cover.png" },
  { id: "section-actionPlan", file: "report-action-plan.png" },
  { id: "section-deepDive", file: "report-deep-dive.png" },
  { id: "section-unifiedGuide", file: "report-guide.png" },
];

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  await page.addInitScript((state) => {
    localStorage.setItem("hexaco_quiz_state", JSON.stringify(state));
  }, quizState);

  // Navigate to a blank page first to set localStorage
  await page.goto("http://localhost:3001/", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.evaluate((state) => {
    localStorage.setItem("hexaco_quiz_state", JSON.stringify(state));
  }, quizState);

  // Now navigate to report with state pre-loaded
  await page.goto("http://localhost:3001/report", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(3000);

  // Debug: check what's visible and find section IDs
  const debug = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('[id^="section-"]'));
    return {
      ids: sections.map(s => s.id),
      bodyPreview: document.body.innerText.substring(0, 300),
    };
  });
  console.log("Section IDs found:", debug.ids);
  console.log("Page preview:", debug.bodyPreview);

  // Scroll through page to trigger scroll-reveal animations
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await delay(200);
    }
    window.scrollTo(0, 0);
    await delay(500);
  });

  for (const { id, file } of screenshots) {
    const el = await page.$(`#${id}`);
    if (!el) {
      console.warn(`Section #${id} not found — skipping`);
      continue;
    }

    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    await el.screenshot({
      path: path.join(outDir, file),
      type: "png",
    });
    console.log(`Captured ${file}`);
  }

  await browser.close();
  console.log("Done — screenshots saved to public/screenshots/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
