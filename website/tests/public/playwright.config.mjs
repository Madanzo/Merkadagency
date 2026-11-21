import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const baseURL = 'http://127.0.0.1:5000';
const firebase = 'npm exec --yes --package firebase-tools@15.37.0 -- firebase';

export default defineConfig({
  testDir: '.',
  use: {
    baseURL,
    launchOptions: { executablePath: process.env.PUBLIC_QA_CHROMIUM },
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], defaultBrowserType: 'chromium' } },
  ],
  webServer: {
    command: (process.env.PUBLIC_QA_FIREBASE || firebase)
      + ' emulators:start --only hosting --project demo-public-qa --config firebase.seo.json',
    cwd: fileURLToPath(new URL('../../../', import.meta.url)),
    url: baseURL,
    timeout: 120_000,
  },
});
