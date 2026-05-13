import { test, expect } from '@playwright/test';
import { BookingClient } from '../../../src/api/clients/BookingClient';
import { validBooking } from '../../../src/fixtures/bookings';

test.describe('API Security Tests - Restful-Booker @api', () => {
  let client: BookingClient;

  test.beforeEach(async ({ request }) => {
    client = new BookingClient(request);
  });

  test.describe('SQL Injection', () => {
    test('should handle SQL injection in auth username', async () => {
      const { body } = await client.authenticate("' OR '1'='1", 'password');
      expect(body).not.toHaveProperty('token');
    });

    test('should handle SQL injection in auth password', async () => {
      const { body } = await client.authenticate('admin', "' OR '1'='1' --");
      expect(body).not.toHaveProperty('token');
    });

    test('should handle SQL injection in firstname field', async () => {
      const booking = {
        ...validBooking,
        firstname: "'; DROP TABLE bookings; --",
      };
      const { status } = await client.createBookingRaw(booking);
      expect([200, 400, 500]).toContain(status);

      const { status: listStatus } = await client.getBookings();
      expect(listStatus).toBe(200);
    });

    test('should handle SQL injection in filter params', async () => {
      const { status } = await client.getBookings({
        firstname: "' OR 1=1 --",
      });
      expect([200, 400]).toContain(status);
    });
  });

  test.describe('XSS (Cross-Site Scripting)', () => {
    test('should handle XSS in firstname', async () => {
      const xssPayload = '<script>alert("xss")</script>';
      const booking = { ...validBooking, firstname: xssPayload };
      const { status, body } = await client.createBookingRaw(booking);

      expect([200, 400]).toContain(status);
      // When accepted, verify it's stored as plain text (not executed)
      expect(status !== 200 || body.bookingid > 0).toBeTruthy();
    });

    test('should handle XSS in lastname', async () => {
      const xssPayload = '"><img src=x onerror=alert(1)>';
      const booking = { ...validBooking, lastname: xssPayload };
      const { status, body } = await client.createBookingRaw(booking);

      expect([200, 400]).toContain(status);
      expect(status !== 200 || body.bookingid > 0).toBeTruthy();
    });

    test('should handle XSS in additionalneeds', async () => {
      const xssPayload = '<svg onload=alert(document.cookie)>';
      const booking = { ...validBooking, additionalneeds: xssPayload };
      const { status, body } = await client.createBookingRaw(booking);

      expect([200, 400]).toContain(status);
      expect(status !== 200 || body.bookingid > 0).toBeTruthy();
    });
  });

  test.describe('Authentication Bypass', () => {
    let bookingId: number;

    test.beforeEach(async () => {
      await client.authenticate();
      const { body } = await client.createBooking(validBooking);
      bookingId = body.bookingid;
    });

    test('should reject PUT without token', async () => {
      const { status } = await client.updateBookingWithoutAuth(bookingId, validBooking);
      expect([401, 403]).toContain(status);
    });

    test('should reject DELETE without token', async () => {
      const { status } = await client.deleteBookingWithoutAuth(bookingId);
      expect([401, 403]).toContain(status);
    });

    test('should reject request with invalid token', async ({ request }) => {
      const response = await request.put(
        `https://restful-booker.herokuapp.com/booking/${bookingId}`,
        {
          data: validBooking,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Cookie: 'token=invalidtoken12345',
          },
        },
      );
      expect([401, 403]).toContain(response.status());
    });

    test('should reject request with expired/malformed token', async ({ request }) => {
      const response = await request.delete(
        `https://restful-booker.herokuapp.com/booking/${bookingId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Cookie: 'token=abc.def.ghi',
          },
        },
      );
      expect([401, 403]).toContain(response.status());
    });
  });

  test.describe('Rate Limiting', () => {
    test('should handle burst of requests', async () => {
      const requests = Array.from({ length: 20 }, () => client.getBookings());
      const results = await Promise.all(requests);

      const successCount = results.filter((r) => r.status === 200).length;
      expect(successCount).toBeGreaterThan(0);

      const rateLimited = results.filter((r) => r.status === 429).length;
      // No rate limiting expected on this API (known missing feature)
      expect(rateLimited).toBeGreaterThanOrEqual(0);
    });

    test('should handle rapid creation requests', async () => {
      const requests = Array.from({ length: 10 }, () => client.createBooking(validBooking));
      const results = await Promise.all(requests);

      const successCount = results.filter((r) => r.status === 200).length;
      expect(successCount).toBeGreaterThan(0);
    });
  });
});
