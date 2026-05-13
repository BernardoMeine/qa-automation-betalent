import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
  ],
  use: {
    baseURL: process.env.SAUCE_DEMO_URL || 'https://www.saucedemo.com/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testDir: './tests/ui',
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testDir: './tests/ui',
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testDir: './tests/ui',
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testDir: './tests/ui',
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
      testDir: './tests/ui',
    },
    {
      name: 'tablet',
      use: { ...devices['iPad (gen 7)'] },
      testDir: './tests/ui',
    },
    {
      name: 'api',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com',
      },
      testDir: './tests/api',
    },
  ],
});
