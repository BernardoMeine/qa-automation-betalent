# Test Cases - UI Testing (Sauce Demo)

## Login Module

| ID     | Title                   | Pre-condition | Steps                                                              | Expected Result                               | Status | Severity |
| ------ | ----------------------- | ------------- | ------------------------------------------------------------------ | --------------------------------------------- | ------ | -------- |
| TC-L01 | Standard user login     | App loaded    | 1. Enter `standard_user` / `secret_sauce` 2. Click Login           | Redirect to inventory page                    | Pass   | Critical |
| TC-L02 | Locked out user         | App loaded    | 1. Enter `locked_out_user` / `secret_sauce` 2. Click Login         | Error: "Sorry, this user has been locked out" | Pass   | High     |
| TC-L03 | Problem user login      | App loaded    | 1. Enter `problem_user` / `secret_sauce` 2. Click Login            | Login succeeds, broken images visible         | Pass   | Medium   |
| TC-L04 | Performance glitch user | App loaded    | 1. Enter `performance_glitch_user` / `secret_sauce` 2. Click Login | Login succeeds with >1s delay                 | Pass   | Medium   |
| TC-L05 | Error user login        | App loaded    | 1. Enter `error_user` / `secret_sauce` 2. Click Login              | Login succeeds                                | Pass   | Low      |
| TC-L06 | Visual user login       | App loaded    | 1. Enter `visual_user` / `secret_sauce` 2. Click Login             | Login succeeds                                | Pass   | Low      |
| TC-L07 | Invalid username        | App loaded    | 1. Enter `invalid_user` / `secret_sauce` 2. Click Login            | Error: username/password don't match          | Pass   | High     |
| TC-L08 | Wrong password          | App loaded    | 1. Enter `standard_user` / `wrong` 2. Click Login                  | Error: username/password don't match          | Pass   | High     |
| TC-L09 | Empty username          | App loaded    | 1. Leave username empty 2. Enter password 3. Click Login           | Error: "Username is required"                 | Pass   | High     |
| TC-L10 | Empty password          | App loaded    | 1. Enter username 2. Leave password empty 3. Click Login           | Error: "Password is required"                 | Pass   | High     |
| TC-L11 | Both fields empty       | App loaded    | 1. Click Login without input                                       | Error: "Username is required"                 | Pass   | Medium   |

## Logout Module

| ID      | Title                         | Pre-condition | Steps                          | Expected Result                    | Status | Severity |
| ------- | ----------------------------- | ------------- | ------------------------------ | ---------------------------------- | ------ | -------- |
| TC-LO01 | Logout via menu               | Logged in     | 1. Open menu 2. Click Logout   | Redirect to login page             | Pass   | Critical |
| TC-LO02 | Access inventory after logout | Logged out    | 1. Navigate to /inventory.html | Error message, redirected to login | Pass   | Critical |
| TC-LO03 | Back button after logout      | Logged out    | 1. Click browser back          | Stays on login page                | Pass   | High     |

## Product Sorting

| ID     | Title               | Pre-condition             | Steps                           | Expected Result                           | Status | Severity |
| ------ | ------------------- | ------------------------- | ------------------------------- | ----------------------------------------- | ------ | -------- |
| TC-S01 | Sort A-Z            | Logged in, inventory page | 1. Select "Name (A to Z)"       | Products sorted alphabetically ascending  | Pass   | High     |
| TC-S02 | Sort Z-A            | Logged in, inventory page | 1. Select "Name (Z to A)"       | Products sorted alphabetically descending | Pass   | High     |
| TC-S03 | Sort Price Low-High | Logged in, inventory page | 1. Select "Price (low to high)" | Products sorted by price ascending        | Pass   | High     |
| TC-S04 | Sort Price High-Low | Logged in, inventory page | 1. Select "Price (high to low)" | Products sorted by price descending       | Pass   | High     |
| TC-S05 | Default sort        | Logged in, inventory page | No action                       | Products sorted A-Z by default            | Pass   | Medium   |

## Cart Management

| ID     | Title                 | Pre-condition  | Steps                               | Expected Result                           | Status | Severity |
| ------ | --------------------- | -------------- | ----------------------------------- | ----------------------------------------- | ------ | -------- |
| TC-C01 | Add single item       | Logged in      | 1. Click "Add to cart" on a product | Badge shows 1, button changes to "Remove" | Pass   | Critical |
| TC-C02 | Add multiple items    | Logged in      | 1. Add 3 different products         | Badge shows 3                             | Pass   | Critical |
| TC-C03 | Remove from inventory | Item in cart   | 1. Click "Remove" on inventory page | Badge decreases, button reverts           | Pass   | High     |
| TC-C04 | Remove from cart page | Item in cart   | 1. Go to cart 2. Click "Remove"     | Item removed from list                    | Pass   | High     |
| TC-C05 | Empty cart badge      | 1 item in cart | 1. Remove last item                 | Badge disappears                          | Pass   | Medium   |
| TC-C06 | Cart persistence      | Items in cart  | 1. Navigate away 2. Return to cart  | Items still present                       | Pass   | High     |

## Checkout Flow

| ID      | Title                  | Pre-condition      | Steps                                          | Expected Result                  | Status | Severity |
| ------- | ---------------------- | ------------------ | ---------------------------------------------- | -------------------------------- | ------ | -------- |
| TC-CH01 | Complete purchase      | Items in cart      | 1. Checkout 2. Fill info 3. Continue 4. Finish | "Thank you for your order!"      | Pass   | Critical |
| TC-CH02 | Subtotal + Tax = Total | Items in cart      | 1. Proceed to overview                         | Math is correct                  | Pass   | High     |
| TC-CH03 | Empty first name       | At checkout step 1 | 1. Leave first name empty 2. Continue          | Error: "First Name is required"  | Pass   | High     |
| TC-CH04 | Empty last name        | At checkout step 1 | 1. Leave last name empty 2. Continue           | Error: "Last Name is required"   | Pass   | High     |
| TC-CH05 | Empty postal code      | At checkout step 1 | 1. Leave postal code empty 2. Continue         | Error: "Postal Code is required" | Pass   | High     |
| TC-CH06 | Cancel checkout        | At checkout step 1 | 1. Click Cancel                                | Return to cart, items preserved  | Pass   | Medium   |

## Navigation

| ID     | Title                   | Pre-condition      | Steps                                   | Expected Result                | Status | Severity |
| ------ | ----------------------- | ------------------ | --------------------------------------- | ------------------------------ | ------ | -------- |
| TC-N01 | Menu - All Items        | On any page        | 1. Open menu 2. Click "All Items"       | Navigate to inventory          | Pass   | Medium   |
| TC-N02 | Menu - About            | Logged in          | 1. Open menu 2. Click "About"           | Navigate to saucelabs.com      | Pass   | Low      |
| TC-N03 | Menu - Reset            | Items in cart      | 1. Open menu 2. Click "Reset App State" | Cart cleared                   | Pass   | Medium   |
| TC-N04 | Footer - Twitter        | Logged in          | 1. Check Twitter link                   | Correct href, target="\_blank" | Pass   | Low      |
| TC-N05 | Footer - Facebook       | Logged in          | 1. Check Facebook link                  | Correct href, target="\_blank" | Pass   | Low      |
| TC-N06 | Footer - LinkedIn       | Logged in          | 1. Check LinkedIn link                  | Correct href, target="\_blank" | Pass   | Low      |
| TC-N07 | Back button in checkout | At checkout step 1 | 1. Press browser back                   | Return to cart                 | Pass   | Medium   |
