import { test, expect } from '@playwright/test';
import { BookingClient } from '../../../src/api/clients/BookingClient';
import { validBooking } from '../../../src/fixtures/bookings';
import { generateBooking } from '../../../src/utils/data-generator';
import { validateBookingResponse } from '../../../src/api/schemas/booking.schema';

test.describe('API Create Booking - Restful-Booker @api', () => {
  let client: BookingClient;

  test.beforeEach(async ({ request }) => {
    client = new BookingClient(request);
  });

  test('should create a booking with valid data', async () => {
    const { status, body } = await client.createBooking(validBooking);

    expect(status).toBe(200);
    expect(body).toHaveProperty('bookingid');
    expect(body.bookingid).toBeGreaterThan(0);
    expect(body.booking.firstname).toBe(validBooking.firstname);
    expect(body.booking.lastname).toBe(validBooking.lastname);
    expect(body.booking.totalprice).toBe(validBooking.totalprice);
    expect(body.booking.depositpaid).toBe(validBooking.depositpaid);
    expect(body.booking.bookingdates.checkin).toBe(validBooking.bookingdates.checkin);
    expect(body.booking.bookingdates.checkout).toBe(validBooking.bookingdates.checkout);
  });

  test('should validate response schema', async () => {
    const { body } = await client.createBooking(validBooking);

    const valid = validateBookingResponse(body);
    expect(valid, JSON.stringify(validateBookingResponse.errors)).toBeTruthy();
  });

  test('should create booking with generated data', async () => {
    const booking = generateBooking();
    const { status, body } = await client.createBooking(booking);

    expect(status).toBe(200);
    expect(body.booking.firstname).toBe(booking.firstname);
    expect(body.booking.lastname).toBe(booking.lastname);
    expect(body.booking.totalprice).toBe(booking.totalprice);
  });

  test('should create booking without additionalneeds', async () => {
    const booking = generateBooking();
    delete booking.additionalneeds;
    const { status, body } = await client.createBooking(booking);

    expect(status).toBe(200);
    expect(body).toHaveProperty('bookingid');
  });

  test('should create multiple bookings with unique IDs', async () => {
    const booking1 = generateBooking();
    const booking2 = generateBooking();

    const result1 = await client.createBooking(booking1);
    const result2 = await client.createBooking(booking2);

    expect(result1.body.bookingid).not.toBe(result2.body.bookingid);
  });
});
