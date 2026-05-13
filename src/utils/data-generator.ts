import { faker } from '@faker-js/faker';
import { Booking } from '../fixtures/bookings';

export function generateBooking(overrides?: Partial<Booking>): Booking {
  const checkin = faker.date.future();
  const checkout = new Date(checkin);
  checkout.setDate(checkout.getDate() + faker.number.int({ min: 1, max: 14 }));

  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 1000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: checkin.toISOString().split('T')[0],
      checkout: checkout.toISOString().split('T')[0],
    },
    additionalneeds: faker.helpers.arrayElement([
      'Breakfast',
      'Lunch',
      'Dinner',
      'Parking',
      'Late checkout',
      'Extra pillows',
    ]),
    ...overrides,
  };
}

export function generateCheckoutInfo() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode(),
  };
}

export function generateMultipleBookings(count: number): Booking[] {
  return Array.from({ length: count }, () => generateBooking());
}
