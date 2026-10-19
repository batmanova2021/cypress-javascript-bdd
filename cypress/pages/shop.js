const byTest = (value) => cy.get(`[data-test="${value}"]`);
const product = (name) => cy.contains('[data-test="inventory-item"]', name);
module.exports = { byTest, product };
