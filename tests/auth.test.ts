import request from 'supertest';
import { app } from '../index';

describe('Auth', () => {
  it('should issue a token on login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'pass123', role: 'viewer', name: 'Viewer' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
  });

  it('should block admin endpoint without token', async () => {
    const res = await request(app).get('/api/users/admin');
    expect(res.status).toBe(401);
  });

  it('should allow admin endpoint with admin role token', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'pass123', role: 'admin', name: 'Admin' });
    const token = login.body.token as string;

    const res = await request(app)
      .get('/api/users/admin')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Admin area');
  });
});
