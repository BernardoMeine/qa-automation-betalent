import { APIRequestContext } from '@playwright/test';
import { Booking } from '../../fixtures/bookings';
import { logger } from '../../utils/logger';

export class BookingClient {
  private token: string | null = null;

  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string = process.env.API_BASE_URL ||
      'https://restful-booker.herokuapp.com',
  ) {}

  async authenticate(
    username: string = process.env.API_AUTH_USERNAME || 'admin',
    password: string = process.env.API_AUTH_PASSWORD || 'password123',
  ) {
    const response = await this.request.post(`${this.baseUrl}/auth`, {
      data: { username, password },
    });
    logger.apiRequest('POST', '/auth', response.status());

    const body = await response.json();
    if (body.token) {
      this.token = body.token;
    }
    return { status: response.status(), body };
  }

  async getBookings(params?: Record<string, string>) {
    let url = `${this.baseUrl}/booking`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const response = await this.request.get(url);
    logger.apiRequest('GET', '/booking', response.status());
    return { status: response.status(), body: await response.json() };
  }

  async getBookingById(id: number) {
    const response = await this.request.get(`${this.baseUrl}/booking/${id}`, {
      headers: { Accept: 'application/json' },
    });
    logger.apiRequest('GET', `/booking/${id}`, response.status());

    if (response.status() === 200) {
      return { status: response.status(), body: await response.json() };
    }
    return { status: response.status(), body: null };
  }

  async createBooking(booking: Booking) {
    const response = await this.request.post(`${this.baseUrl}/booking`, {
      data: booking,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    logger.apiRequest('POST', '/booking', response.status());
    return { status: response.status(), body: await response.json() };
  }

  async updateBooking(id: number, booking: Booking) {
    const response = await this.request.put(`${this.baseUrl}/booking/${id}`, {
      data: booking,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${this.token}`,
      },
    });
    logger.apiRequest('PUT', `/booking/${id}`, response.status());

    if (response.status() === 200) {
      return { status: response.status(), body: await response.json() };
    }
    return { status: response.status(), body: await response.text() };
  }

  async partialUpdateBooking(id: number, partialBooking: Partial<Booking>) {
    const response = await this.request.patch(`${this.baseUrl}/booking/${id}`, {
      data: partialBooking,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${this.token}`,
      },
    });
    logger.apiRequest('PATCH', `/booking/${id}`, response.status());

    if (response.status() === 200) {
      return { status: response.status(), body: await response.json() };
    }
    return { status: response.status(), body: await response.text() };
  }

  async deleteBooking(id: number) {
    const response = await this.request.delete(`${this.baseUrl}/booking/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${this.token}`,
      },
    });
    logger.apiRequest('DELETE', `/booking/${id}`, response.status());
    return { status: response.status() };
  }

  async deleteBookingWithoutAuth(id: number) {
    const response = await this.request.delete(`${this.baseUrl}/booking/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return { status: response.status() };
  }

  async updateBookingWithoutAuth(id: number, booking: Booking) {
    const response = await this.request.put(`${this.baseUrl}/booking/${id}`, {
      data: booking,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return { status: response.status(), body: await response.text() };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createBookingRaw(data: any) {
    const response = await this.request.post(`${this.baseUrl}/booking`, {
      data,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    logger.apiRequest('POST', '/booking (raw)', response.status());
    try {
      return { status: response.status(), body: await response.json() };
    } catch {
      return { status: response.status(), body: await response.text() };
    }
  }

  getToken(): string | null {
    return this.token;
  }
}
