const {
  Given,
  When,
  Then,
} = require('@badeball/cypress-cucumber-preprocessor');
require('cypress-mochawesome-reporter/cucumberSupport');
const { byTest, product } = require('../pages/shop');

Given('I am on the login page', () => cy.visit('/'));
Given('I am logged in', () => cy.login());
When('I log in as the {string} user', (role) => {
  cy.fixture('users').then((users) => {
    const user = users[role];
    byTest('username').type(user.username);
    byTest('password').type(user.password, { log: false });
    byTest('login-button').click();
  });
});
When('I submit an empty login form', () => byTest('login-button').click());
Then('I see the inventory', () => {
  cy.location('pathname').should('eq', '/inventory.html');
  byTest('inventory-item').should('have.length.greaterThan', 0);
});
Then('I see an error containing {string}', (message) =>
  byTest('error').should('be.visible').and('contain.text', message),
);
When('I log out', () => {
  cy.get('#react-burger-menu-btn').click();
  byTest('logout-sidebar-link').click();
});
Then('I see the login page', () => byTest('login-button').should('be.visible'));
When('I sort products by {string}', (order) =>
  byTest('product-sort-container').select(order),
);
Then('product {string} values are sorted {string}', (field, direction) => {
  byTest(
    field === 'name' ? 'inventory-item-name' : 'inventory-item-price',
  ).then(($elements) => {
    const values = [...$elements].map((element) =>
      field === 'name'
        ? element.textContent
        : Number(element.textContent.replace('$', '')),
    );
    const sorted = [...values].sort((a, b) =>
      field === 'name' ? a.localeCompare(b) : a - b,
    );
    if (direction === 'descending') sorted.reverse();
    expect(values).to.deep.equal(sorted);
  });
});
When('I open the primary product', () =>
  cy
    .fixture('products')
    .then(({ primary }) =>
      product(primary).find('[data-test="inventory-item-name"]').click(),
    ),
);
Then('I see its product details', () => {
  cy.fixture('products').then(({ primary }) =>
    byTest('inventory-item-name').should('have.text', primary),
  );
  byTest('inventory-item-desc').should('not.be.empty');
  byTest('inventory-item-price').should('contain.text', '$');
});
When('I return to products', () => byTest('back-to-products').click());
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
    .then(({ primary }) => product(primary).find('button').click()),
);
Then('the cart is empty', () => {
  byTest('inventory-item').should('not.exist');
  byTest('shopping-cart-badge').should('not.exist');
});
When('I continue shopping', () => byTest('continue-shopping').click());
Given('I am checking out with a product', () => {
  cy.login();
  cy.fixture('products').then(({ primary }) => cy.addProductToCart(primary));
  byTest('shopping-cart-link').click();
  byTest('checkout').click();
});
When('I submit checkout with {string} missing', (field) => {
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
Then('I see the checkout overview', () => {
  cy.location('pathname').should('eq', '/checkout-step-two.html');
  cy.fixture('products').then(({ primary }) =>
    product(primary).should('be.visible'),
  );
  byTest('total-label').should('contain.text', 'Total: $');
});
When('I finish checkout', () => byTest('finish').click());
Then('the order is complete', () => {
  byTest('complete-header').should('have.text', 'Thank you for your order!');
  byTest('shopping-cart-badge').should('not.exist');
});
When('I cancel checkout', () => byTest('cancel').click());
Then('I see the cart', () =>
  cy.location('pathname').should('eq', '/cart.html'),
);
