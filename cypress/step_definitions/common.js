const { Then } = require('@badeball/cypress-cucumber-preprocessor');
require('cypress-mochawesome-reporter/cucumberSupport');
const { byTest } = require('../pages/shop');
Then('I see an error containing {string}', (message) =>
  byTest('error').should('be.visible').and('contain.text', message),
);
