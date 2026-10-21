const {
  Given,
  When,
  Then,
} = require('@badeball/cypress-cucumber-preprocessor');
const { byTest } = require('../pages/shop');

Given('I am on the login page', () => cy.visit('/'));
Given('I am logged in', () => cy.login());
When('I log in as the {string} user', (role) => {
  cy.fixture('users').then((users) => {
    const user = users[role];
    expect(user, `fixture user role: ${role}`).to.exist;
    byTest('username').type(user.username);
    byTest('password').type(user.password, { log: false });
    byTest('login-button').click();
  });
});
When('I submit an empty login form', () => byTest('login-button').click());
When('I log out', () => {
  cy.contains('button', /^Open Menu$/).click();
  byTest('logout-sidebar-link').click();
});
Then('I see the login page', () => byTest('login-button').should('be.visible'));
