/// <reference types="cypress" />

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /** Restore the standard demo user's session and open authenticated inventory. */
      login(): Chainable<unknown>;
      /** Add the exact named product and verify its Remove action appears. */
      addProductToCart(name: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
