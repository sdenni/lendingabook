const request = require('supertest');
const app = require('../app');

describe('Members API', () => {
  it('should fetch all member', async () => {
    const res = await request(app).get('/api/members');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should create a new member', async () => {
    const res = await request(app)
      .post('/api/members')
      .send({
        code: 'XD12',
        name: 'SDenni',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });
});
