# Environment Variables - API Testing

## Configuration File

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

## Variables

### API Testing - Restful-Booker

| Variable            | Description                         | Default Value                          | Required |
| ------------------- | ----------------------------------- | -------------------------------------- | -------- |
| `API_BASE_URL`      | Base URL for the Restful-Booker API | `https://restful-booker.herokuapp.com` | Yes      |
| `API_AUTH_USERNAME` | Username for API authentication     | `admin`                                | Yes      |
| `API_AUTH_PASSWORD` | Password for API authentication     | `password123`                          | Yes      |

### UI Testing - Sauce Demo

| Variable              | Description             | Default Value                | Required |
| --------------------- | ----------------------- | ---------------------------- | -------- |
| `SAUCE_DEMO_URL`      | Base URL for Sauce Demo | `https://www.saucedemo.com/` | Yes      |
| `SAUCE_DEMO_USER`     | Default test user       | `standard_user`              | No       |
| `SAUCE_DEMO_PASSWORD` | Default test password   | `secret_sauce`               | No       |

### Test Configuration

| Variable    | Description                              | Default Value    | Required |
| ----------- | ---------------------------------------- | ---------------- | -------- |
| `CI`        | Running in CI environment                | `false`          | No       |
| `HEADLESS`  | Run browser in headless mode             | `true`           | No       |
| `RETRIES`   | Number of test retries                   | `0` (2 in CI)    | No       |
| `WORKERS`   | Number of parallel workers               | `auto` (2 in CI) | No       |
| `LOG_LEVEL` | Logger verbosity (debug/info/warn/error) | `info`           | No       |

## Postman Environment Variables

The Postman collection uses the following variables (configured in the environment file):

| Variable        | Description        | How Set                     |
| --------------- | ------------------ | --------------------------- |
| `{{baseUrl}}`   | API base URL       | Manual                      |
| `{{username}}`  | Auth username      | Manual                      |
| `{{password}}`  | Auth password      | Manual                      |
| `{{token}}`     | Auth token         | Auto (from auth response)   |
| `{{bookingId}}` | Created booking ID | Auto (from create response) |

## Security Notes

- Never commit `.env` files to version control
- The `.gitignore` already excludes `.env`
- Use `.env.example` as a template (safe to commit)
- In CI/CD, configure variables as repository secrets
- Default values are for the public test APIs (intentionally shareable)

## k6 Environment

For k6 performance tests, pass variables via CLI:

```bash
k6 run -e API_BASE_URL=https://restful-booker.herokuapp.com tests/api/performance/load-test.js
```
