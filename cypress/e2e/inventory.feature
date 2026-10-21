@regression
Feature: Inventory browsing

  Background:
    Given I am logged in

  Scenario Outline: Sort the catalog
    When I sort products by "<order>"
    Then product "<field>" values are sorted "<direction>"

    Examples:
      | order             | field | direction  |
      | name A to Z       | name  | ascending  |
      | name Z to A       | name  | descending |
      | price low to high | price | ascending  |
      | price high to low | price | descending |

  Scenario: Inspect product details
    When I open the primary product
    Then I see its product details

  Scenario: Return from product details
    When I open the primary product
    And I return to products
    Then I see the inventory
