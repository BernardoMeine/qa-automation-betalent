# Test Plan - UI Testing (Sauce Demo)

## 1. Objective

Validate the complete user experience of the Sauce Demo e-commerce application through automated end-to-end tests covering authentication, product management, shopping cart, checkout flow, and navigation.

## 2. Scope

### In Scope

- Login/Logout functionality with all user types
- Product listing, sorting, and filtering
- Shopping cart management (add, remove, persist)
- Complete purchase flow (checkout → payment → confirmation)
- Navigation (menu, footer links, browser history)
- Responsive design across mobile, tablet, and desktop viewports
- Accessibility compliance (WCAG 2.1 AA)
- Cross-browser compatibility (Chromium, Firefox, WebKit)

### Out of Scope

- Backend API of Sauce Demo (not publicly available)
- Payment processing (demo application)
- Email notifications
- User registration (not available)
- Database-level testing

## 3. Test Approach

### Strategy

- **Page Object Model (POM)**: All page interactions abstracted into reusable classes
- **Data-Driven Testing**: User credentials and test data managed via fixtures
- **Web-First Assertions**: No fixed waits; rely on Playwright's auto-waiting
- **Parallel Execution**: Tests run in parallel for faster feedback

### Test Types

| Type              | Tool                   | Coverage       |
| ----------------- | ---------------------- | -------------- |
| Functional E2E    | Playwright             | All user flows |
| Responsive        | Playwright viewports   | 3 breakpoints  |
| Accessibility     | axe-core               | WCAG 2.1 AA    |
| Cross-browser     | Playwright projects    | 3 engines      |
| Visual (optional) | Playwright screenshots | Key pages      |

## 4. Test Environment

- **URL**: https://www.saucedemo.com/
- **Browsers**: Chromium, Firefox, WebKit
- **Viewports**: Mobile (390×844), Tablet (810×1080), Desktop (1920×1080)
- **OS**: Cross-platform (CI runs on Ubuntu)

## 5. Test Data

| User                    | Purpose                |
| ----------------------- | ---------------------- |
| standard_user           | Happy path testing     |
| locked_out_user         | Error handling         |
| problem_user            | UI defect detection    |
| performance_glitch_user | Performance validation |
| error_user              | Error state handling   |
| visual_user             | Visual regression      |

**Password (all)**: `secret_sauce`

## 6. Entry Criteria

- Application is accessible at the test URL
- All test dependencies installed
- Playwright browsers downloaded
- Environment variables configured

## 7. Exit Criteria

- All Level 1 tests pass on Chromium
- No critical or blocker bugs unresolved
- Test coverage meets acceptance threshold (>90% of scenarios)
- Documentation complete

## 8. Risk Assessment

See `risk-analysis.md` for detailed risk matrix.

## 9. Deliverables

- Automated test suite (Playwright)
- HTML test report
- Bug analysis documentation
- Screenshots/videos of failures
- CI/CD pipeline integration
