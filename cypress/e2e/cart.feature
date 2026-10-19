@regression
Feature: Shopping cart

  Background:
    Given I am logged in

  @smoke
  Scenario: Add multiple products using a data table
    When I add these products:
      | product               |
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
    Then the cart badge is "2"
    When I open the cart
    Then the cart contains these products:
      | product               |
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |

  Scenario: Add one product
    When I add the primary product
    Then the cart badge is "1"
    When I open the cart
    Then the primary product is in the cart

  Scenario: Remove a product from inventory
    When I add the primary product
    And I remove the primary product
    And I open the cart
    Then the cart is empty

  Scenario: Remove a product from the cart
    When I add the primary product
    And I open the cart
    And I remove the primary product
    Then the cart is empty

  Scenario: Continue browsing from cart
    When I open the cart
    And I continue shopping
    Then I see the inventory
