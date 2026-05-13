import { test, expect } from '@playwright/test';
import { BookingClient } from '../../../src/api/clients/BookingClient';
import { validBooking, updatedBooking, partialUpdate } from '../../../src/fixtures/bookings';
import { validateBooking } from '../../../src/api/schemas/booking.schema';

test.describe('API Update Booking - Restful-Booker @api', () => {
  let client: BookingClient;
  let createdBookingId: number;

  test.beforeEach(async ({ request }) => {
    client = new BookingClient(request);
    await client.authenticate();
    const { body } = await client.createBooking(validBooking);
    createdBookingId = body.bookingid;
  });

  test.describe('PUT - Full Update', () => {
    test('should update entire booking with authentication', async () => {
      const { status, body } = await client.updateBooking(createdBookingId, updatedBooking);

      expect(status).toBe(200);
      expect(body.firstname).toBe(updatedBooking.firstname);
      expect(body.lastname).toBe(updatedBooking.lastname);
      expect(body.totalprice).toBe(updatedBooking.totalprice);
      expect(body.depositpaid).toBe(updatedBooking.depositpaid);
    });

    test('should validate schema after PUT update', async () => {
      const { body } = await client.updateBooking(createdBookingId, updatedBooking);

      const valid = validateBooking(body);
      expect(valid).toBeTruthy();
    });

    test('should persist changes after update', async () => {
      await client.updateBooking(createdBookingId, updatedBooking);
      const { body } = await client.getBookingById(createdBookingId);

      expect(body.firstname).toBe(updatedBooking.firstname);
      expect(body.lastname).toBe(updatedBooking.lastname);
    });

    test('should reject update without authentication', async () => {
      const { status } = await client.updateBookingWithoutAuth(
        createdBookingId,
        updatedBooking,
      );

      expect([403, 401]).toContain(status);
    });
  });

  test.describe('PATCH - Partial Update', () => {
    test('should partially update booking with authentication', async () => {
      const { status, body } = await client.partialUpdateBooking(
        createdBookingId,
        partialUpdate,
      );

      expect(status).toBe(200);
      expect(body.firstname).toBe(partialUpdate.firstname);
      expect(body.lastname).toBe(partialUpdate.lastname);
      // Other fields should remain unchanged
      expect(body.totalprice).toBe(validBooking.totalprice);
    });

    test('should update only price', async () => {
      const { status, body } = await client.partialUpdateBooking(createdBookingId, {
        totalprice: 999,
      });

      expect(status).toBe(200);
      expect(body.totalprice).toBe(999);
      expect(body.firstname).toBe(validBooking.firstname);
    });

    test('should update only dates', async () => {
      const newDates = {
        bookingdates: {
          checkin: '2025-06-01',
          checkout: '2025-06-15',
        },
      };
      const { status, body } = await client.partialUpdateBooking(
        createdBookingId,
        newDates,
      );

      expect(status).toBe(200);
      expect(body.bookingdates.checkin).toBe('2025-06-01');
      expect(body.bookingdates.checkout).toBe('2025-06-15');
    });

    test('should validate schema after PATCH update', async () => {
      const { body } = await client.partialUpdateBooking(createdBookingId, partialUpdate);
      const valid = validateBooking(body);
      expect(valid).toBeTruthy();
    });
  });
});
