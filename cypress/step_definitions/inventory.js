const { When, Then } = require('@badeball/cypress-cucumber-preprocessor');
const { byTest, product } = require('../pages/shop');

Then('I see the inventory', () => {
  cy.location('pathname').should('eq', '/inventory.html');
  byTest('inventory-item').should('have.length.greaterThan', 0);
});
const sortOptions = {
  'name A to Z': 'az',
  'name Z to A': 'za',
  'price low to high': 'lohi',
  'price high to low': 'hilo',
};
When('I sort products by {string}', (order) => {
  expect(sortOptions, `supported sort choice: ${order}`).to.have.property(
    order,
  );
  byTest('product-sort-container').select(sortOptions[order]);
});
Then('product {string} values are sorted {string}', (field, direction) => {
  byTest(
    field === 'name' ? 'inventory-item-name' : 'inventory-item-price',
  ).should(($elements) => {
    expect($elements.length, 'products to sort').to.be.greaterThan(1);
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
