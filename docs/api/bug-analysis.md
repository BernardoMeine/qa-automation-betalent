# Bug Analysis - API Testing (Restful-Booker)

## API-BUG-001: Authentication Returns 200 for Invalid Credentials

- **Severity**: Medium
- **Endpoint**: `POST /auth`
- **Description**: Invalid credentials return HTTP 200 with `{"reason":"Bad credentials"}` instead of the standard 401 Unauthorized.
- **Expected Behavior**: Return 401 status code for failed authentication
- **Actual Behavior**: Returns 200 with error message in body
- **Impact**: Client-side code must check response body rather than status code; breaks RESTful conventions
- **Suggestion**: Return 401 for failed auth, 200 only when token is issued

---

## API-BUG-002: DELETE Returns 201 Instead of 200/204

- **Severity**: Low
- **Endpoint**: `DELETE /booking/:id`
- **Description**: Successful deletion returns HTTP 201 (Created) instead of 200 (OK) or 204 (No Content).
- **Expected Behavior**: Return 200 or 204 for successful deletion
- **Actual Behavior**: Returns 201 Created
- **Impact**: Confusing semantics; 201 implies resource creation, not deletion
- **Suggestion**: Return 204 No Content for successful deletion

---

## API-BUG-003: No Input Validation for Data Types

- **Severity**: High
- **Endpoint**: `POST /booking`
- **Description**: The API accepts invalid data types without validation:
  - String values accepted for `totalprice` (should be number)
  - Invalid date formats accepted for `bookingdates`
  - String accepted for `depositpaid` (should be boolean)
- **Steps to Reproduce**:
  1. POST to `/booking` with `"totalprice": "not_a_number"`
  2. Observe 200 response with booking created
- **Expected**: Return 400 Bad Request with validation error
- **Actual**: Booking created with invalid data
- **Impact**: Data integrity issues, potential errors in downstream systems
- **Suggestion**: Implement JSON Schema validation middleware

---

## API-BUG-004: PATCH Endpoint Inconsistent Auth Requirement

- **Severity**: High
- **Endpoint**: `PATCH /booking/:id`
- **Description**: The PATCH endpoint occasionally accepts requests without a valid authentication token, allowing unauthorized partial updates.
- **Steps to Reproduce**:
  1. Create a booking
  2. Send PATCH request without Cookie/token header
  3. Observe that some requests succeed
- **Expected**: Always return 401/403 without valid token
- **Actual**: Intermittently allows unauthenticated updates
- **Impact**: Security vulnerability - unauthorized data modification
- **Suggestion**: Enforce authentication middleware consistently on all protected endpoints

---

## API-BUG-005: No Rate Limiting

- **Severity**: Medium
- **Endpoint**: All endpoints
- **Description**: The API does not implement rate limiting. Burst requests (20+ concurrent) all succeed without throttling.
- **Steps to Reproduce**:
  1. Send 20 concurrent GET /booking requests
  2. Observe all return 200
- **Expected**: Rate limiting after threshold (e.g., 429 Too Many Requests)
- **Actual**: All requests succeed
- **Impact**: Vulnerable to DDoS, resource exhaustion, scraping
- **Suggestion**: Implement rate limiting (e.g., 100 requests/minute per IP)

---

## API-BUG-006: No Content-Length Validation

- **Severity**: Medium
- **Endpoint**: `POST /booking`
- **Description**: The API accepts extremely long strings (10,000+ characters) in name fields without rejecting them.
- **Steps to Reproduce**:
  1. POST booking with `firstname` = 10,000 character string
  2. Observe 200 response
- **Expected**: Return 400 or 413 (Payload Too Large) for unreasonable input
- **Actual**: Accepts and stores the data
- **Impact**: Storage abuse, potential buffer issues
- **Suggestion**: Add max-length validation (e.g., 255 chars for name fields)

---

## API-BUG-007: Inconsistent Error Response Format

- **Severity**: Low
- **Endpoint**: Various
- **Description**: Error responses do not follow a consistent format:
  - Auth errors: `{"reason":"Bad credentials"}`
  - Not found: Plain text "Not Found"
  - Server errors: HTML error page
- **Expected**: Consistent JSON error format (e.g., `{"error":"message","code":404}`)
- **Actual**: Mixed response formats
- **Impact**: Difficult error handling in client applications
- **Suggestion**: Standardize error responses to JSON with error code and message

---

## API-BUG-008: Missing CORS Headers Documentation

- **Severity**: Low
- **Endpoint**: All
- **Description**: CORS headers are configured but not documented, making it unclear which origins are permitted for browser-based API calls.
- **Impact**: Integration difficulty for frontend developers
- **Suggestion**: Document CORS policy in API documentation

---

## Summary

| Bug ID | Severity | Category | Status |
|--------|----------|----------|--------|
| API-BUG-001 | Medium | Standards | Open |
| API-BUG-002 | Low | Standards | Open |
| API-BUG-003 | High | Validation | Open |
| API-BUG-004 | High | Security | Open |
| API-BUG-005 | Medium | Security | Open |
| API-BUG-006 | Medium | Validation | Open |
| API-BUG-007 | Low | Standards | Open |
| API-BUG-008 | Low | Documentation | Open |
