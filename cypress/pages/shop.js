const byTest = (value) => cy.get(`[data-test="${value}"]`);
const exactText = (text) => new RegExp(`^${Cypress._.escapeRegExp(text)}$`);

// Match the product title, not a substring in the card's description.
const product = (name) =>
  cy
    .contains('[data-test="inventory-item-name"]', exactText(name))
    .closest('[data-test="inventory-item"]')
    .should('have.length', 1);

const productAction = (name, action) =>
  product(name).contains('button', exactText(action));

module.exports = { byTest, product, productAction };
