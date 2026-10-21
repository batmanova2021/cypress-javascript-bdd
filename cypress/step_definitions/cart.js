const { When, Then } = require('@badeball/cypress-cucumber-preprocessor');
const { byTest, product, productAction } = require('../pages/shop');

When('I add the primary product', () =>
  cy.fixture('products').then(({ primary }) => cy.addProductToCart(primary)),
);
When('I add these products:', (table) =>
  table.hashes().forEach(({ product: name }) => cy.addProductToCart(name)),
);
When('I open the cart', () => byTest('shopping-cart-link').click());
Then('the cart contains these products:', (table) => {
  byTest('inventory-item').should('have.length', table.hashes().length);
  table
    .hashes()
    .forEach(({ product: name }) => product(name).should('be.visible'));
});
Then('the cart badge is {string}', (count) =>
  byTest('shopping-cart-badge').should('have.text', count),
);
Then('the primary product is in the cart', () =>
  cy
    .fixture('products')
    .then(({ primary }) => product(primary).should('be.visible')),
);
When('I remove the primary product', () =>
  cy
    .fixture('products')
    .then(({ primary }) => productAction(primary, 'Remove').click()),
);
Then('the cart is empty', () => {
  byTest('inventory-item').should('not.exist');
  byTest('shopping-cart-badge').should('not.exist');
});
When('I continue shopping', () => byTest('continue-shopping').click());
