const request = require('supertest');
const app = require('../src/server');

let user;

beforeEach(() => {
  user = {
    email: 'magtataho@gmail.com',
    password: 'magtataho'
  };
});

afterEach(() => {
  app.close();
});

describe('Auth Endpoint Tests', () => {
  test('should return an access token if email and password is valid', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send(user)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8');

    console.log(response.body);

    expect(response.body.access_token).not.toBeUndefined();
  });
});
