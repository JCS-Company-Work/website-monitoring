require('dotenv').config();

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  use: {
    headless: true,
    baseURL: process.env.TM_STORE_URL,
  },

  reporter: 'html',
});