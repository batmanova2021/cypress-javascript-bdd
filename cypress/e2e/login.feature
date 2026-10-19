@regression
Feature: Authentication

  @smoke
  Scenario: Standard user signs in
    Given I am on the login page
    When I log in as the "standard" user
    Then I see the inventory

  Scenario Outline: Rejected credentials
    Given I am on the login page
    When I log in as the "<role>" user
    Then I see an error containing "<message>"

    Examples:
      | role    | message                               |
      | locked  | Sorry, this user has been locked out. |
      | invalid | Username and password do not match    |

  Scenario: Required username
    Given I am on the login page
    When I submit an empty login form
    Then I see an error containing "Username is required"

  Scenario: User logs out
    Given I am logged in
    When I log out
    Then I see the login page
