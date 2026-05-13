# API Test Scenarios - Restful-Booker

## Base URL
`https://restful-booker.herokuapp.com`

---

## 1. Authentication (`POST /auth`)

### Positive Scenarios
| # | Scenario | Payload | Expected |
|---|----------|---------|----------|
| A01 | Valid credentials | `{"username":"admin","password":"password123"}` | 200, `{"token":"<string>"}` |
| A02 | Token stored for reuse | Valid auth → use token | Cookie accepted in subsequent requests |

### Negative Scenarios
| # | Scenario | Payload | Expected |
|---|----------|---------|----------|
| A03 | Invalid username | `{"username":"wrong","password":"password123"}` | 200, `{"reason":"Bad credentials"}` |
| A04 | Invalid password | `{"username":"admin","password":"wrong"}` | 200, `{"reason":"Bad credentials"}` |
| A05 | Empty credentials | `{"username":"","password":""}` | 200, `{"reason":"Bad credentials"}` |
| A06 | SQL injection in username | `{"username":"' OR '1'='1","password":"x"}` | No token returned |

---

## 2. Create Booking (`POST /booking`)

### Positive Scenarios
| # | Scenario | Expected |
|---|----------|----------|
| B01 | Valid complete booking | 200, returns `{bookingid, booking}` |
| B02 | Without additionalneeds | 200, field omitted or null |
| B03 | Generated random data | 200, all fields match |
| B04 | Multiple unique bookings | Each gets unique ID |

### Negative Scenarios
| # | Scenario | Expected |
|---|----------|----------|
| B05 | Missing firstname | 400 or 500 |
| B06 | Missing lastname | 400 or 500 |
| B07 | Missing totalprice | 400 or 500 |
| B08 | Missing depositpaid | 400 or 500 |
| B09 | Missing bookingdates | 400 or 500 |
| B10 | String in totalprice | 400/500 (or accepts - known bug) |
| B11 | Invalid date format | 400/500 (or accepts - known bug) |
| B12 | Empty body `{}` | 400 or 500 |
| B13 | Null values | 400 or 500 |
| B14 | Extremely long strings (10K chars) | 400/413/500 or accepts |

---

## 3. Read Booking (`GET /booking` and `GET /booking/:id`)

### Positive Scenarios
| # | Scenario | Expected |
|---|----------|----------|
| C01 | List all bookings | 200, array of `{bookingid}` |
| C02 | Get booking by valid ID | 200, booking object |
| C03 | Filter by firstname | 200, filtered array |
| C04 | Filter by lastname | 200, filtered array |
| C05 | Filter by checkin date | 200, filtered array |
| C06 | Filter by checkout date | 200, filtered array |

### Negative Scenarios
| # | Scenario | Expected |
|---|----------|----------|
| C07 | Non-existent ID (999999999) | 404 |
| C08 | Invalid ID format | 400 or 404 |

---

## 4. Update Booking (`PUT /booking/:id`)

### Positive Scenarios
| # | Scenario | Expected |
|---|----------|----------|
| D01 | Full update with valid token | 200, updated booking |
| D02 | Schema valid after update | Passes JSON Schema validation |
| D03 | Changes persist (GET after PUT) | Returns updated data |

### Negative Scenarios
| # | Scenario | Expected |
|---|----------|----------|
| D04 | Update without authentication | 401 or 403 |
| D05 | Update with invalid token | 401 or 403 |
| D06 | Update non-existent booking | 404 or 405 |

---

## 5. Partial Update (`PATCH /booking/:id`)

### Positive Scenarios
| # | Scenario | Expected |
|---|----------|----------|
| E01 | Update firstname/lastname only | 200, only those fields changed |
| E02 | Update only totalprice | 200, price updated, rest unchanged |
| E03 | Update only dates | 200, dates updated |
| E04 | Schema valid after PATCH | Passes validation |

### Negative Scenarios
| # | Scenario | Expected |
|---|----------|----------|
| E05 | PATCH without auth | 401 or 403 |
| E06 | PATCH non-existent ID | 404 or 405 |

---

## 6. Delete Booking (`DELETE /booking/:id`)

### Positive Scenarios
| # | Scenario | Expected |
|---|----------|----------|
| F01 | Delete with valid token | 200 or 201 |
| F02 | GET after delete returns 404 | Booking no longer accessible |
| F03 | Deleted ID not in listing | Not present in GET /booking |

### Negative Scenarios
| # | Scenario | Expected |
|---|----------|----------|
| F04 | Delete without auth | 401 or 403 |
| F05 | Delete non-existent ID | 404 or 405 |

---

## 7. Security Scenarios

| # | Scenario | Expected |
|---|----------|----------|
| S01 | SQL Injection in auth username | No token, no data leak |
| S02 | SQL Injection in auth password | No token |
| S03 | SQL Injection in firstname (create) | API still functional after |
| S04 | SQL Injection in filter params | No data leak |
| S05 | XSS in firstname | Stored as plain text |
| S06 | XSS in lastname | Stored as plain text |
| S07 | XSS in additionalneeds | Stored as plain text |
| S08 | PUT without token | 401/403 |
| S09 | DELETE without token | 401/403 |
| S10 | Invalid token format | 401/403 |
| S11 | Expired/malformed token | 401/403 |
| S12 | Burst requests (rate limit) | Requests handled, possible 429 |

---

## 8. Performance Scenarios (k6)

| # | Scenario | Threshold |
|---|----------|-----------|
| P01 | Ramp up 10→50→100 VUs | p(95) < 500ms |
| P02 | Auth endpoint under load | Response time stable |
| P03 | Create booking under load | < 1000ms p(95) |
| P04 | Read booking under load | < 500ms p(95) |
| P05 | Error rate | < 10% |
