const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');
const { connectDB, disconnectDB, clearDB } = require('./db');

jest.setTimeout(30000);

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await clearDB();
  await disconnectDB();
});

beforeEach(async () => {
  await clearDB();
});

describe('GET /api/auth/:id', () => {
  it('should create a new user', async () => {
    const newUser = {
      username: 'John Doe',
      email: 'john.doe@example.com',
      password: 'pass123',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(newUser);

    const id = response._body.user._id;

    const res = await request(app)
      .get('/api/auth/' + id)

    expect(res.status).toBe(200);
  });
});
