import { test, expect } from '@playwright/test';
import { BookingClient } from '../../../src/api/clients/BookingClient';
import { validBooking } from '../../../src/fixtures/bookings';

test.describe('API Delete Booking - Restful-Booker @api', () => {
  let client: BookingClient;
  let createdBookingId: number;

  test.beforeEach(async ({ request }) => {
    client = new BookingClient(request);
    await client.authenticate();
    const { body } = await client.createBooking(validBooking);
    createdBookingId = body.bookingid;
  });

  test('should delete booking with valid authentication', async () => {
    const { status } = await client.deleteBooking(createdBookingId);

    // Restful-Booker returns 201 on successful delete
    expect([200, 201]).toContain(status);
  });

  test('should return 404 when getting deleted booking', async () => {
    await client.deleteBooking(createdBookingId);

    const { status } = await client.getBookingById(createdBookingId);
    expect(status).toBe(404);
  });

  test('should not be able to delete without authentication', async () => {
    const { status } = await client.deleteBookingWithoutAuth(createdBookingId);

    expect([403, 401]).toContain(status);
  });

  test('deleted booking should not appear in listing', async () => {
    await client.deleteBooking(createdBookingId);

    const { body } = await client.getBookings();
    const ids = body.map((b: { bookingid: number }) => b.bookingid);
    expect(ids).not.toContain(createdBookingId);
  });

  test('should handle deleting non-existent booking', async () => {
    const { status } = await client.deleteBooking(999999999);

    // API may return 404 or 405 for non-existent
    expect([404, 405]).toContain(status);
  });
});
