import { test, expect } from '@playwright/test';
import { BookingClient } from '../../../src/api/clients/BookingClient';
import { validateAuthToken } from '../../../src/api/schemas/booking.schema';

test.describe('API Authentication - Restful-Booker @api', () => {
  let client: BookingClient;

  test.beforeEach(async ({ request }) => {
    client = new BookingClient(request);
  });

  test('should return token with valid credentials', async () => {
    const { status, body } = await client.authenticate('admin', 'password123');

    expect(status).toBe(200);
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);

    const valid = validateAuthToken(body);
    expect(valid).toBeTruthy();
  });

  test('should reject invalid username', async () => {
    const { status, body } = await client.authenticate('invalid_user', 'password123');

    expect(status).toBe(200);
    expect(body).not.toHaveProperty('token');
    expect(body).toHaveProperty('reason', 'Bad credentials');
  });

  test('should reject invalid password', async () => {
    const { status, body } = await client.authenticate('admin', 'wrong_password');

    expect(status).toBe(200);
    expect(body).not.toHaveProperty('token');
    expect(body).toHaveProperty('reason', 'Bad credentials');
  });

  test('should reject empty credentials', async () => {
    const { status, body } = await client.authenticate('', '');

    expect(status).toBe(200);
    expect(body).not.toHaveProperty('token');
    expect(body).toHaveProperty('reason', 'Bad credentials');
  });

  test('token should be stored for subsequent requests', async () => {
    await client.authenticate('admin', 'password123');
    const token = client.getToken();
    expect(token).not.toBeNull();
    expect(token!.length).toBeGreaterThan(0);
  });
});
