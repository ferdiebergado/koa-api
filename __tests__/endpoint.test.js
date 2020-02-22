const request = require('supertest');
const app = require('../src/server');

const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
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

describe('Auth Component Tests', () => {
  describe('Login Endpoint Tests', () => {
    test('should return an access token if email and password is valid', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send(user)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.body.access_token).not.toBeUndefined();
    });
    test('should fail when email is blank', async () => {
      delete user.email;
      const response = await request(app)
        .post('/auth/login')
        .send(user)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(422);
      expect(response.body.error).toMatch('"email" is required');
    });

    test('should fail when email is invalid', async () => {
      user.email = 'invalid@notadomain';
      const response = await request(app)
        .post('/auth/login')
        .send(user)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(422);
      expect(response.body.error).toMatch('"email" must be a valid email');
    });

    test('should fail when email is too long (> 150 chars)', async () => {
      user.email = longText;
      const response = await request(app)
        .post('/auth/login')
        .send(user)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(422);
      expect(response.body.error).toMatch(
        '"email" length must be less than or equal to 150 characters long'
      );
    });
    test('should fail when password is blank', async () => {
      delete user.password;
      const response = await request(app)
        .post('/auth/login')
        .send(user)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(422);
      expect(response.body.error).toMatch('"password" is required');
    });

    test('should fail when password is less than 8 characters', async () => {
      user.password = '1234567';
      const response = await request(app)
        .post('/auth/login')
        .send(user)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(422);
      expect(response.body.error).toMatch('"password" length must be at least 8 characters long');
    });

    test('should fail when password is more than 150 characters', async () => {
      user.password = longText;
      const response = await request(app)
        .post('/auth/login')
        .send(user)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(422);
      expect(response.body.error).toMatch(
        '"password" length must be less than or equal to 150 characters long'
      );
    });
  });
});

describe('Users Component Tests', () => {
  describe('Show User Endpoint Tests', () => {
    test('should return a user when param is valid', async () => {
      const response = await request(app)
        .get('/users/7')
        .expect('Content-Type', 'application/json; charset=utf-8');

      console.log(response.body);
      expect(response.status).toEqual(200);
      expect(response.body.data).toMatchObject({
        id: 7,
        name: 'abc',
        email: 'abc@123.com',
        role: 3,
        created_at: '2020-02-08T05:31:20.775Z'
      });
    });
    test('should fail when param is invalid', async () => {
      const response = await request(app)
        .get('/users/a')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(422);
      expect(response.body.error).toMatch('"user" must be a number');
    });
  });
});
