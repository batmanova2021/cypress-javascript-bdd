@regression
Feature: Checkout

  Background:
    Given I am checking out with a product

  Scenario Outline: Required customer details
    When I submit checkout with "<field>" missing
    Then I see an error containing "<message>"

    Examples:
      | field       | message                 |
      | first name  | First Name is required  |
      | last name   | Last Name is required   |
      | postal code | Postal Code is required |

  Scenario: Review order
    When I enter valid checkout details
    Then I see the checkout overview

  @smoke
  Scenario: Complete an order
    When I enter valid checkout details
    Then I see the checkout overview
    When I finish checkout
    Then the order is complete

  Scenario: Cancel customer information
    When I cancel checkout
    Then I see the cart
    And the primary product is in the cart

  Scenario: Cancel order overview
    When I enter valid checkout details
    And I cancel checkout
    Then I see the inventory
    And the cart badge is "1"
