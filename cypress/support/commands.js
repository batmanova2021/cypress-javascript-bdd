const { byTest, productAction } = require('../pages/shop');

Cypress.Commands.add('login', () => {
  return cy
    .fixture('users')
    .then(({ standard }) => {
      return cy.session(
        ['standard', standard.username],
        () => {
          cy.visit('/');
          byTest('username').type(standard.username);
          byTest('password').type(standard.password, { log: false });
          byTest('login-button').click();
          cy.location('pathname').should('eq', '/inventory.html');
          byTest('inventory-item').should('have.length.greaterThan', 0);
        },
        {
          validate() {
            cy.getCookie('session-username')
              .should('exist')
              .and('have.property', 'value', standard.username);
            // A cookie alone does not prove the restored session can access inventory.
            cy.visit('/?/inventory.html');
            cy.location('pathname').should('eq', '/inventory.html');
            byTest('inventory-item').should('have.length.greaterThan', 0);
          },
        },
      );
    })
    .then(() => {
      // cy.session clears the page after validation; establish the command's postcondition.
      cy.visit('/?/inventory.html');
      cy.location('pathname').should('eq', '/inventory.html');
      return byTest('inventory-item').should('have.length.greaterThan', 0);
    });
});

Cypress.Commands.add('addProductToCart', (name) => {
  productAction(name, 'Add to cart').click();
  return productAction(name, 'Remove').should('be.visible');
});
