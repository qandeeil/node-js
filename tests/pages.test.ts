import mongoose from 'mongoose';
import { app } from '../index';
import request from 'supertest';
import config from '../src/config';
import { PageService } from '../src/modules/pages/page-service';

/**
 * This test suite verifies cursor-based pagination for /api/pages
 * It connects to Mongo only for the duration of these tests.
 */
describe('Pages pagination', () => {
  const service = new PageService();

  beforeAll(async () => {
    // Ensure DB connection for tests (index skips connecting when NODE_ENV==='test')
    await mongoose.connect(config.mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear and seed
    await service.clearAll();
    const total = 25;
    for (let i = 1; i <= total; i++) {
      // Ensure increasing _id by creating sequentially
      // Titles help identify order
      await service.create(`Page ${String(i).padStart(2, '0')}`, `Content ${i}`);
    }
  });

  it('returns first page with nextCursor when more items exist', async () => {
    const res = await request(app).get('/api/pages?limit=10');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveLength(10);
    expect(res.body).toHaveProperty('nextCursor');
    expect(typeof res.body.nextCursor === 'string' || res.body.nextCursor === null).toBeTruthy();
  });

  it('uses nextCursor to fetch the next page without overlap', async () => {
    const first = await request(app).get('/api/pages?limit=10');
    const nextCursor = first.body.nextCursor as string;
    expect(nextCursor).toBeTruthy();

    const second = await request(app).get(`/api/pages?limit=10&cursor=${encodeURIComponent(nextCursor)}`);
    expect(second.status).toBe(200);
    expect(second.body.data).toHaveLength(10);

    // Ensure no overlap between first page last id and second page items
    const firstLastId = first.body.data[first.body.data.length - 1].id;
    const secondIds: string[] = second.body.data.map((d: any) => d.id);
    expect(secondIds).not.toContain(firstLastId);
  });

  it('returns remaining items on the last page and null nextCursor', async () => {
    // total 25, page size 10 => 3rd page should have 5 items
    const p1 = await request(app).get('/api/pages?limit=10');
    const p2 = await request(app).get(`/api/pages?limit=10&cursor=${encodeURIComponent(p1.body.nextCursor)}`);
    const p3 = await request(app).get(`/api/pages?limit=10&cursor=${encodeURIComponent(p2.body.nextCursor)}`);
    expect(p3.status).toBe(200);
    expect(p3.body.data.length).toBe(5);
    expect(p3.body.nextCursor).toBeNull();
  });
});
