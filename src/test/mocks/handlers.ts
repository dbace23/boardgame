import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*/api/games', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Catan',
        description: 'Trade, build and settle.',
        rating: 4.5,
      },
    ]);
  }),

  http.post('*/auth/login', async ({ request }) => {
    const body = await request.json();
    
    if (body.phone === '+1234567890' && body.pin === '123456') {
      return HttpResponse.json({
        user: { id: '1', name: 'Test User' },
        token: 'fake-token',
      });
    }
    
    return new HttpResponse(null, { status: 401 });
  }),
];