// Load environment variables from .env file
require('dotenv').config();

// Pull in the Playwright test configuration function
const { defineConfig } = require('@playwright/test');

// Define the Playwright test configuration
module.exports = defineConfig({

  // Specify the directory where test files are located
  testDir: './tests',

  // Set the maximum time a test can run before timing out
  use: {
    headless: true,
    baseURL: process.env.TM_STORE_URL,
    extraHTTPHeaders: {
      'X-Monitoring-Run': 'true'
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Define the test reporter configuration
  reporter: [
    ['./src/reporting/TestReporter.js']
  ],

});