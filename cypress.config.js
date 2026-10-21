const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const {
  addCucumberPreprocessorPlugin,
} = require('@badeball/cypress-cucumber-preprocessor');
const {
  createEsbuildPlugin,
} = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const fix = require('cypress-on-fix');

module.exports = defineConfig({
  projectId: process.env.CYPRESS_PROJECT_ID || '67tngp',
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveJson: true,
    reportPageTitle: 'Sauce Demo BDD Portfolio',
  },
  video: true,
  screenshotOnRunFailure: true,
  retries: { runMode: process.env.CI ? 2 : 0, openMode: 0 },
  viewportWidth: 1280,
  viewportHeight: 800,
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    specPattern: 'cypress/e2e/**/*.feature',
    async setupNodeEvents(cypressOn, config) {
      const on = fix(cypressOn);
      await addCucumberPreprocessorPlugin(on, config);
      on(
        'file:preprocessor',
        createBundler({ plugins: [createEsbuildPlugin(config)] }),
      );
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
});
