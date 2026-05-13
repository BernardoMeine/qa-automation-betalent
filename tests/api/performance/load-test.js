/**
 * k6 Load Test Script for Restful-Booker API
 *
 * Install k6: https://k6.io/docs/get-started/installation/
 * Run: k6 run tests/api/performance/load-test.js
 */
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.API_BASE_URL || 'https://restful-booker.herokuapp.com';

const errorRate = new Rate('errors');
const createBookingDuration = new Trend('create_booking_duration');
const getBookingDuration = new Trend('get_booking_duration');
const authDuration = new Trend('auth_duration');

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up to 10 VUs
    { duration: '1m', target: 50 },   // Ramp up to 50 VUs
    { duration: '30s', target: 100 }, // Ramp up to 100 VUs
    { duration: '1m', target: 100 },  // Stay at 100 VUs
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    errors: ['rate<0.1'],
    create_booking_duration: ['p(95)<1000'],
    get_booking_duration: ['p(95)<500'],
  },
};

function getAuthToken() {
  const payload = JSON.stringify({
    username: 'admin',
    password: 'password123',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(`${BASE_URL}/auth`, payload, params);
  authDuration.add(res.timings.duration);

  check(res, {
    'auth status is 200': (r) => r.status === 200,
    'auth returns token': (r) => JSON.parse(r.body).token !== undefined,
  });

  return JSON.parse(res.body).token;
}

function createBooking(token) {
  const payload = JSON.stringify({
    firstname: `User_${__VU}_${__ITER}`,
    lastname: 'LoadTest',
    totalprice: Math.floor(Math.random() * 500) + 50,
    depositpaid: true,
    bookingdates: {
      checkin: '2024-01-01',
      checkout: '2024-01-10',
    },
    additionalneeds: 'Breakfast',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Cookie: `token=${token}`,
    },
  };

  const res = http.post(`${BASE_URL}/booking`, payload, params);
  createBookingDuration.add(res.timings.duration);

  const success = check(res, {
    'create booking status is 200': (r) => r.status === 200,
    'create booking has id': (r) => JSON.parse(r.body).bookingid !== undefined,
  });

  errorRate.add(!success);

  if (res.status === 200) {
    return JSON.parse(res.body).bookingid;
  }
  return null;
}

function getBooking(bookingId) {
  const params = {
    headers: { Accept: 'application/json' },
  };

  const res = http.get(`${BASE_URL}/booking/${bookingId}`, params);
  getBookingDuration.add(res.timings.duration);

  const success = check(res, {
    'get booking status is 200': (r) => r.status === 200,
    'get booking has firstname': (r) => JSON.parse(r.body).firstname !== undefined,
  });

  errorRate.add(!success);
}

function listBookings() {
  const res = http.get(`${BASE_URL}/booking`);

  check(res, {
    'list bookings status is 200': (r) => r.status === 200,
    'list bookings returns array': (r) => Array.isArray(JSON.parse(r.body)),
  });
}

export default function () {
  let token;

  group('Authentication', () => {
    token = getAuthToken();
  });

  sleep(1);

  group('Create Booking', () => {
    const bookingId = createBooking(token);

    if (bookingId) {
      sleep(0.5);

      group('Read Booking', () => {
        getBooking(bookingId);
      });
    }
  });

  sleep(1);

  group('List Bookings', () => {
    listBookings();
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: '  ', enableColors: true }),
  };
}

function textSummary(data, opts) {
  // k6 built-in summary
  return JSON.stringify(data, null, 2);
}
