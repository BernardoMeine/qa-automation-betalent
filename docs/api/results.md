# API Test Results - Restful-Booker

## Test Execution Summary

| Module           | Total  | Passed | Failed  | Skipped | Pass Rate |
| ---------------- | ------ | ------ | ------- | ------- | --------- |
| Authentication   | 5      | 5      | 0       | 0       | 100%      |
| Create Booking   | 5      | 5      | 0       | 0       | 100%      |
| Read Booking     | 8      | 8      | 0       | 0       | 100%      |
| Update Booking   | 8      | 7      | 1\*     | 0       | 87.5%     |
| Delete Booking   | 5      | 5      | 0       | 0       | 100%      |
| Field Validation | 11     | 8      | 3\*\*   | 0       | 72.7%     |
| Security         | 11     | 10     | 1\*\*\* | 0       | 90.9%     |
| **Total**        | **53** | **48** | **5**   | **0**   | **90.6%** |

_\* PUT without auth may intermittently pass due to known Restful-Booker behavior_
_\*\* API accepts invalid types due to weak validation (documented as known bugs)_
_\*\*\* Rate limiting not implemented (no 429 responses)_

---

## Performance Test Results (k6)

### Configuration

- **Stages**: 10 VUs → 50 VUs → 100 VUs → 100 VUs sustained → ramp down
- **Duration**: ~3.5 minutes total
- **Endpoint**: https://restful-booker.herokuapp.com

### Metrics

| Metric                  | Value  | Threshold | Status  |
| ----------------------- | ------ | --------- | ------- |
| http_req_duration (p50) | ~150ms | -         | OK      |
| http_req_duration (p95) | ~450ms | < 500ms   | OK      |
| http_req_duration (p99) | ~900ms | -         | Warning |
| Error Rate              | ~3%    | < 10%     | OK      |
| Create Booking (p95)    | ~600ms | < 1000ms  | OK      |
| Get Booking (p95)       | ~300ms | < 500ms   | OK      |
| Auth (p95)              | ~400ms | -         | OK      |
| Total Requests          | ~2500  | -         | -       |
| Requests/sec (avg)      | ~12    | -         | -       |

### Observations

1. Response times increase under high concurrency (100 VUs)
2. Occasional 5xx errors during peak load (expected for free-tier service)
3. Auth endpoint is the slowest under load
4. GET operations consistently faster than POST operations

---

## Environment Details

| Property     | Value                                |
| ------------ | ------------------------------------ |
| Base URL     | https://restful-booker.herokuapp.com |
| Protocol     | HTTPS                                |
| Auth Method  | Cookie-based token                   |
| Content-Type | application/json                     |
| Test Runner  | Playwright Test + k6                 |
| Node Version | 20.x                                 |

---

## Known Issues Encountered

1. **Restful-Booker returns 200 for bad auth** instead of 401 (design choice)
2. **DELETE returns 201** instead of standard 200/204
3. **Weak input validation** - accepts strings for number fields
4. **No rate limiting** - all burst requests succeed
5. **PATCH may work without auth** in some scenarios (intermittent bug)

---

## Recommendations

1. Monitor API stability - Heroku free tier may have cold starts
2. Run performance tests during off-peak hours for consistent results
3. Consider adding retry logic for flaky tests due to infrastructure
4. Field validation tests document API behavior rather than enforce strict standards
