export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface BookingResponse {
  bookingid: number;
  booking: Booking;
}

export const validBooking: Booking = {
  firstname: 'John',
  lastname: 'Doe',
  totalprice: 150,
  depositpaid: true,
  bookingdates: {
    checkin: '2024-01-01',
    checkout: '2024-01-10',
  },
  additionalneeds: 'Breakfast',
};

export const updatedBooking: Booking = {
  firstname: 'Jane',
  lastname: 'Smith',
  totalprice: 250,
  depositpaid: false,
  bookingdates: {
    checkin: '2024-02-01',
    checkout: '2024-02-15',
  },
  additionalneeds: 'Lunch',
};

export const partialUpdate: Partial<Booking> = {
  firstname: 'Updated',
  lastname: 'Name',
};

export const invalidBookings = {
  missingFirstname: {
    lastname: 'Doe',
    totalprice: 100,
    depositpaid: true,
    bookingdates: { checkin: '2024-01-01', checkout: '2024-01-05' },
  },
  missingLastname: {
    firstname: 'John',
    totalprice: 100,
    depositpaid: true,
    bookingdates: { checkin: '2024-01-01', checkout: '2024-01-05' },
  },
  missingTotalprice: {
    firstname: 'John',
    lastname: 'Doe',
    depositpaid: true,
    bookingdates: { checkin: '2024-01-01', checkout: '2024-01-05' },
  },
  missingDepositpaid: {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 100,
    bookingdates: { checkin: '2024-01-01', checkout: '2024-01-05' },
  },
  missingBookingdates: {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 100,
    depositpaid: true,
  },
  invalidPriceType: {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 'not_a_number',
    depositpaid: true,
    bookingdates: { checkin: '2024-01-01', checkout: '2024-01-05' },
  },
  invalidDateFormat: {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 100,
    depositpaid: true,
    bookingdates: { checkin: 'invalid-date', checkout: 'also-invalid' },
  },
  invalidDepositType: {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 100,
    depositpaid: 'yes',
    bookingdates: { checkin: '2024-01-01', checkout: '2024-01-05' },
  },
};
