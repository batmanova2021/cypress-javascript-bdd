const { byTest, product } = require('../pages/shop');
Cypress.Commands.add('login', () => {
  cy.fixture('users').then(({ standard }) => {
    cy.session(
      ['standard', standard.username],
      () => {
        cy.visit('/');
        byTest('username').type(standard.username);
        byTest('password').type(standard.password, { log: false });
        byTest('login-button').click();
        cy.location('pathname').should('eq', '/inventory.html');
      },
      {
        validate() {
          cy.getAllCookies().should('satisfy', (cookies) =>
            cookies.some((cookie) => cookie.name === 'session-username'),
          );
        },
      },
    );
  });
  // GitHub Pages serves deep routes through the SPA query-string redirect.
  cy.visit('/?/inventory.html');
  cy.location('pathname').should('eq', '/inventory.html');
});
Cypress.Commands.add('addProductToCart', (name) => {
  product(name).find('button').should('have.text', 'Add to cart').click();
});
