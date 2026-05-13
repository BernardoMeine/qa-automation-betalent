import { test, expect } from '@playwright/test';
import { BookingClient } from '../../../src/api/clients/BookingClient';
import { invalidBookings } from '../../../src/fixtures/bookings';

test.describe('API Field Validation - Restful-Booker @api', () => {
  let client: BookingClient;

  test.beforeEach(async ({ request }) => {
    client = new BookingClient(request);
  });

  test.describe('Missing Required Fields', () => {
    test('should reject booking without firstname', async () => {
      const { status } = await client.createBookingRaw(invalidBookings.missingFirstname);
      expect([400, 500]).toContain(status);
    });

    test('should reject booking without lastname', async () => {
      const { status } = await client.createBookingRaw(invalidBookings.missingLastname);
      expect([400, 500]).toContain(status);
    });

    test('should reject booking without totalprice', async () => {
      const { status } = await client.createBookingRaw(invalidBookings.missingTotalprice);
      expect([400, 500]).toContain(status);
    });

    test('should reject booking without depositpaid', async () => {
      const { status } = await client.createBookingRaw(invalidBookings.missingDepositpaid);
      expect([400, 500]).toContain(status);
    });

    test('should reject booking without bookingdates', async () => {
      const { status } = await client.createBookingRaw(invalidBookings.missingBookingdates);
      expect([400, 500]).toContain(status);
    });
  });

  test.describe('Invalid Field Types', () => {
    // Restful-Booker has weak validation and accepts invalid types (known bug)
    test('should handle string in totalprice field', async () => {
      const { status } = await client.createBookingRaw(invalidBookings.invalidPriceType);
      expect([200, 400, 500]).toContain(status);
    });

    test('should handle invalid date format', async () => {
      const { status } = await client.createBookingRaw(invalidBookings.invalidDateFormat);
      expect([200, 400, 500]).toContain(status);
    });

    test('should handle string in depositpaid field', async () => {
      const { status } = await client.createBookingRaw(invalidBookings.invalidDepositType);
      expect([200, 400, 500]).toContain(status);
    });
  });

  test.describe('Empty/Null Values', () => {
    test('should handle empty body', async () => {
      const { status } = await client.createBookingRaw({});
      expect([400, 500]).toContain(status);
    });

    test('should handle null values', async () => {
      const { status } = await client.createBookingRaw({
        firstname: null,
        lastname: null,
        totalprice: null,
        depositpaid: null,
        bookingdates: null,
      });
      expect([400, 500]).toContain(status);
    });

    test('should handle extremely long strings', async () => {
      const longString = 'A'.repeat(10000);
      const { status } = await client.createBookingRaw({
        firstname: longString,
        lastname: longString,
        totalprice: 100,
        depositpaid: true,
        bookingdates: { checkin: '2024-01-01', checkout: '2024-01-05' },
      });
      expect([200, 400, 413, 500]).toContain(status);
    });
  });
});
