const {
  Given,
  When,
  Then,
} = require('@badeball/cypress-cucumber-preprocessor');
const { byTest } = require('../pages/shop');

const {
  captureOrderFromCart,
  assertOrderOverview,
} = require('../pages/checkout');

Given('I am checking out with a product', () => {
  cy.login();
  cy.fixture('products').then(({ primary }) => cy.addProductToCart(primary));
  byTest('shopping-cart-link').click();
  captureOrderFromCart();
  byTest('checkout').click();
});
When('I submit checkout with {string} missing', (fieldName) => {
  const fields = {
    'first name': 'firstName',
    'last name': 'lastName',
    'postal code': 'postalCode',
  };
  expect(fields, `supported customer field: ${fieldName}`).to.have.property(
    fieldName,
  );
  const field = fields[fieldName];
  cy.fixture('checkout').then((details) => {
    if (field !== 'firstName') byTest('firstName').type(details.firstName);
    if (field !== 'lastName') byTest('lastName').type(details.lastName);
    if (field !== 'postalCode') byTest('postalCode').type(details.postalCode);
    byTest('continue').click();
  });
});
When('I enter valid checkout details', () => {
  cy.fixture('checkout').then((details) => {
    Object.entries(details).forEach(([field, value]) =>
      byTest(field).type(value),
    );
    byTest('continue').click();
  });
});
Then('I see the checkout overview', () => assertOrderOverview());
When('I finish checkout', () => byTest('finish').click());
Then('the order is complete', () => {
  byTest('complete-header').should('have.text', 'Thank you for your order!');
  byTest('shopping-cart-badge').should('not.exist');
});
When('I cancel checkout', () => byTest('cancel').click());
Then('I see the cart', () =>
  cy.location('pathname').should('eq', '/cart.html'),
);
