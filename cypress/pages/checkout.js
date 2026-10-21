const { byTest } = require('./shop');

// Compare money in integer cents to avoid floating-point rounding errors.
const cents = (text) => {
  const match = text.trim().match(/\$(\d+)\.(\d{2})$/);
  expect(match, `currency amount: ${text}`).not.to.be.null;
  return Number(match[1]) * 100 + Number(match[2]);
};

const readItems = ($items) =>
  [...$items].map((item) => {
    const $item = Cypress.$(item);
    const name = $item.find('[data-test="inventory-item-name"]').text().trim();
    const quantity = Number($item.find('[data-test="item-quantity"]').text());
    expect(name, 'product name').not.to.be.empty;
    expect(quantity, 'item quantity').to.be.a('number').and.be.greaterThan(0);
    expect(Number.isInteger(quantity), 'whole item quantity').to.equal(true);
    return {
      name,
      quantity,
      unitPrice: cents($item.find('[data-test="inventory-item-price"]').text()),
    };
  });

const captureOrderFromCart = () => {
  cy.location('pathname').should('eq', '/cart.html');
  return byTest('inventory-item')
    .should(($items) => {
      expect($items.length, 'cart items').to.be.greaterThan(0);
      readItems($items);
    })
    .then(($items) => readItems($items))
    .as('expectedOrder', { type: 'static' });
};

const assertOrderOverview = () => {
  cy.location('pathname').should('eq', '/checkout-step-two.html');
  return cy.get('@expectedOrder').then((expected) => {
    byTest('inventory-item').should(($items) => {
      const byName = (a, b) => a.name.localeCompare(b.name);
      expect(
        readItems($items).sort(byName),
        'order names, quantities, and prices',
      ).to.deep.equal([...expected].sort(byName));
    });
    const subtotal = expected.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    byTest('checkout-summary-container').should(($summary) => {
      const amount = (testId) =>
        cents($summary.find(`[data-test="${testId}"]`).text());
      expect(amount('subtotal-label'), 'subtotal in cents').to.equal(subtotal);
      const tax = amount('tax-label');
      expect(tax, 'tax in cents').to.be.at.least(0);
      expect(amount('total-label'), 'subtotal plus displayed tax').to.equal(
        subtotal + tax,
      );
    });
  });
};

module.exports = { captureOrderFromCart, assertOrderOverview };
