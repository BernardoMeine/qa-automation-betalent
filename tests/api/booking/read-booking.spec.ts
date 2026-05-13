import { test, expect } from '@playwright/test';
import { BookingClient } from '../../../src/api/clients/BookingClient';
import { validBooking } from '../../../src/fixtures/bookings';
import { validateBooking, validateBookingIds } from '../../../src/api/schemas/booking.schema';

test.describe('API Read Booking - Restful-Booker @api', () => {
  let client: BookingClient;
  let createdBookingId: number;

  test.beforeEach(async ({ request }) => {
    client = new BookingClient(request);
    const { body } = await client.createBooking(validBooking);
    createdBookingId = body.bookingid;
  });

  test('should list all bookings', async () => {
    const { status, body } = await client.getBookings();

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    const valid = validateBookingIds(body);
    expect(valid).toBeTruthy();
  });

  test('should get a specific booking by ID', async () => {
    const { status, body } = await client.getBookingById(createdBookingId);

    expect(status).toBe(200);
    expect(body).not.toBeNull();
    expect(body.firstname).toBe(validBooking.firstname);
    expect(body.lastname).toBe(validBooking.lastname);
    expect(body.totalprice).toBe(validBooking.totalprice);
    expect(body.depositpaid).toBe(validBooking.depositpaid);
  });

  test('should validate booking schema on GET', async () => {
    const { body } = await client.getBookingById(createdBookingId);

    const valid = validateBooking(body);
    if (!valid) {
      console.log('Schema errors:', validateBooking.errors);
    }
    expect(valid).toBeTruthy();
  });

  test('should return 404 for non-existent booking', async () => {
    const { status } = await client.getBookingById(999999999);
    expect(status).toBe(404);
  });

  test('should filter bookings by firstname', async () => {
    const { status, body } = await client.getBookings({
      firstname: validBooking.firstname,
    });

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('should filter bookings by lastname', async () => {
    const { status, body } = await client.getBookings({
      lastname: validBooking.lastname,
    });

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('should filter bookings by checkin date', async () => {
    const { status, body } = await client.getBookings({
      checkin: validBooking.bookingdates.checkin,
    });

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('should filter bookings by checkout date', async () => {
    const { status, body } = await client.getBookings({
      checkout: validBooking.bookingdates.checkout,
    });

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
  });
});
