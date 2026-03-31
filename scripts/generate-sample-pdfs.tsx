/**
 * Generate 4 sample reports via the frontend.
 * Loads each sample profile from sample-profiles.ts into the quiz store,
 * navigates to /report, and downloads the PDF.
 *
 * Usage: npx playwright test
 *   (Requires dev server running on localhost:3000)
 */
import { test } from "@playwright/test";
import { mkdirSync, readFileSync } from "fs";
import { join } from "path";

// Read sample profiles from the TS source to get the raw JSON data.
// We parse the exported results directly rather than importing (avoids TS path aliases).
const sampleProfilesPath = join(process.cwd(), "src/lib/data/sample-profiles.ts");

// The sample profiles are defined in sample-profiles.ts.
// We'll inject them into localStorage in the Zustand persist format.
interface SampleProfile {
  id: string;
  name: string;
  results: Record<string, unknown>;
}

// Hardcode the 4 profiles' names and IDs — the results come from localStorage
// after loading the /reports page (which injects sample data automatically).
const profiles = [
  { name: "Liam Torres", slug: "liam-torres", id: "sample-liam-torres" },
  { name: "Zara Okafor", slug: "zara-okafor", id: "sample-zara-okafor" },
  { name: "Ethan Bridges", slug: "ethan-bridges", id: "sample-ethan-bridges" },
  { name: "Priya Nair", slug: "priya-nair", id: "sample-priya-nair" },
];

const SAMPLES_DIR = join(process.cwd(), "samples");

for (const profile of profiles) {
  test(`Generate report: ${profile.name}`, async ({ page }) => {
    test.setTimeout(120000);
    const dir = join(SAMPLES_DIR, profile.slug);
    mkdirSync(dir, { recursive: true });

    // 1. Navigate to /reports to trigger sample profile loading
    await page.goto("http://localhost:3000/reports");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // 2. Load this specific profile by clicking on it or injecting via store
    //    The reports-store auto-loads sample profiles on mount.
    //    We need to "load" a profile which sets quiz-store results + name.
    await page.evaluate(
      ({ id, name }) => {
        // Read saved reports from localStorage
        const raw = localStorage.getItem("hexaco_saved_reports");
        if (!raw) throw new Error("No saved reports found in localStorage");
        const reports = JSON.parse(raw);
        const target = reports.find((r: any) => r.id === id);
        if (!target) throw new Error(`Profile ${id} not found. Available: ${reports.map((r: any) => r.id).join(", ")}`);

        // Convert dimensions from map format ({H: {...}, E: {...}}) to array format
        // The report generator expects DimensionScore[] (array), not a map object.
        const results = { ...target.results };
        if (results.dimensions && !Array.isArray(results.dimensions)) {
          const dimMap = results.dimensions as Record<string, any>;
          const dimOrder = ["H", "E", "X", "A", "C", "O"];
          results.dimensions = dimOrder
            .filter((key) => dimMap[key])
            .map((key) => {
              const d = dimMap[key];
              return {
                name: key,
                score: d.score,
                facets: d.facets
                  ? Object.values(d.facets).map((f: any) => ({
                      name: f.name,
                      score: f.score,
                    }))
                  : [],
              };
            });
        }

        // Set the quiz store state with this profile's results
        const quizState = {
          state: {
            answers: {},
            currentIndex: 0,
            name: name,
            email: "",
            dob: "",
            quizMode: "complete",
            results,
          },
          version: 0,
        };
        localStorage.setItem("hexaco_quiz_state", JSON.stringify(quizState));
      },
      { id: profile.id, name: profile.name }
    );

    // 3. Navigate to /report — it reads results from the quiz store
    await page.goto("http://localhost:3000/report");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(5000);

    // 4. Expand all collapsible sections
    const toggleButtons = page.locator('button[aria-expanded="false"], details:not([open]) summary, [data-collapsible] button');
    const count = await toggleButtons.count();
    for (let i = 0; i < count; i++) {
      try { await toggleButtons.nth(i).click({ timeout: 1000 }); } catch { /* skip non-interactive */ }
    }
    await page.waitForTimeout(2000);

    // Screenshot for verification
    await page.screenshot({
      path: join(dir, "report-full.png"),
      fullPage: true,
    });

    // 5. Print report page directly as PDF using Playwright's page.pdf()
    //    This bypasses @react-pdf entirely and uses Chrome's print engine.
    const pdfPath = join(dir, `${profile.slug}-learning-profile.pdf`);

    // Add print-friendly styles
    await page.addStyleTag({
      content: `
        @media print {
          .no-print, nav, .sticky, [data-floating-toc] { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `,
    });

    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
    });

    console.log(`  ✅ ${profile.name} → ${pdfPath}`);
  });
}
