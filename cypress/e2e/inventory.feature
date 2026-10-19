@regression
Feature: Inventory browsing

  Background:
    Given I am logged in

  Scenario Outline: Sort the catalog
    When I sort products by "<order>"
    Then product "<field>" values are sorted "<direction>"

    Examples:
      | order | field | direction  |
      | az    | name  | ascending  |
      | za    | name  | descending |
      | lohi  | price | ascending  |
      | hilo  | price | descending |

  Scenario: Inspect product details
    When I open the primary product
    Then I see its product details

  Scenario: Return from product details
    When I open the primary product
    And I return to products
    Then I see the inventory
