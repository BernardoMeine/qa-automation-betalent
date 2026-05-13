import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export const bookingSchema = {
  type: 'object',
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    totalprice: { type: 'number' },
    depositpaid: { type: 'boolean' },
    bookingdates: {
      type: 'object',
      properties: {
        checkin: { type: 'string' },
        checkout: { type: 'string' },
      },
      required: ['checkin', 'checkout'],
    },
    additionalneeds: { type: 'string' },
  },
  required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'],
  additionalProperties: false,
};

export const bookingResponseSchema = {
  type: 'object',
  properties: {
    bookingid: { type: 'number' },
    booking: bookingSchema,
  },
  required: ['bookingid', 'booking'],
  additionalProperties: false,
};

export const bookingIdsSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      bookingid: { type: 'number' },
    },
    required: ['bookingid'],
  },
};

export const authTokenSchema = {
  type: 'object',
  properties: {
    token: { type: 'string' },
  },
  required: ['token'],
  additionalProperties: false,
};

export const validateBooking = ajv.compile(bookingSchema);
export const validateBookingResponse = ajv.compile(bookingResponseSchema);
export const validateBookingIds = ajv.compile(bookingIdsSchema);
export const validateAuthToken = ajv.compile(authTokenSchema);
