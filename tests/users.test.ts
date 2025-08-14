import request from 'supertest';
import { app } from '../index';

describe('Users Routes', () => {
  describe('GET /api/users', () => {
    it('should return 202 and a user object', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(202);
      expect(res.body).toHaveProperty('name');
    });
  });

  describe('POST /api/users/create', () => {
    it('should fail validation with 400 when body is invalid', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ email: 'not-an-email' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should create a user and return 201 with payload (without password)', async () => {
      const payload = { name: 'Test User', email: 'test@example.com', age: 25, password: 'secret123', role: 'viewer' };
      const res = await request(app)
        .post('/api/users/create')
        .send(payload);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ name: payload.name, email: payload.email, age: payload.age, role: 'viewer' });
      expect(res.body).not.toHaveProperty('passwordHash');
    });
  });

  describe('Auth flow', () => {
    it('should login and access /me with token', async () => {
      // create user
      await request(app)
        .post('/api/users/create')
        .send({ name: 'Admin', email: 'admin@example.com', password: 'pass123' });

      // login
      const login = await request(app)
        .post('/api/users/login')
        .send({ email: 'admin@example.com', password: 'pass123' });
      expect(login.status).toBe(200);
      const token = login.body.token as string;
      expect(token).toBeTruthy();

      // access /me
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', 'admin@example.com');
    });

    it('should block /me without token', async () => {
      const res = await request(app).get('/api/users/me');
      expect(res.status).toBe(401);
    });
  });
});
