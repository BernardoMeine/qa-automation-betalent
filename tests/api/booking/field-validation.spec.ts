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
      // Restful-Booker returns 500 for validation errors (known behavior)
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
    test('should handle string in totalprice field', async () => {
      const { status, body } = await client.createBookingRaw(invalidBookings.invalidPriceType);

      // Restful-Booker may accept this due to weak validation (known bug)
      if (status === 200) {
        // Document: API accepts string for totalprice without validation
        expect(body).toHaveProperty('bookingid');
      } else {
        expect([400, 500]).toContain(status);
      }
    });

    test('should handle invalid date format', async () => {
      const { status, body } = await client.createBookingRaw(invalidBookings.invalidDateFormat);

      // Restful-Booker may accept this due to weak date validation (known bug)
      if (status === 200) {
        expect(body).toHaveProperty('bookingid');
      } else {
        expect([400, 500]).toContain(status);
      }
    });

    test('should handle string in depositpaid field', async () => {
      const { status, body } = await client.createBookingRaw(
        invalidBookings.invalidDepositType,
      );

      if (status === 200) {
        expect(body).toHaveProperty('bookingid');
      } else {
        expect([400, 500]).toContain(status);
      }
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

      // API should either accept or return a meaningful error
      expect([200, 400, 413, 500]).toContain(status);
    });
  });
});
