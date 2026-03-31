import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./scripts",
  testMatch: "generate-sample-pdfs.tsx",
  timeout: 180000,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
});
