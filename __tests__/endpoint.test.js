const request = require('supertest');
const app = require('../src/server');
const db = require('../src/db');

const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
let user;
let newUser;

beforeEach(() => {
  user = {
    email: 'magtataho@gmail.com',
    password: 'magtataho'
  };
  newUser = {
    name: 'test user 3',
    email: 'test3@example.com',
    password: 'testuser3',
    password_confirmation: 'testuser3'
  };
});

afterEach(async () => {
  try {
    const deleteNewUser = {
      text: 'DELETE FROM users WHERE email = $1',
      values: [newUser.email]
    };
    await db.query(deleteNewUser);
    console.log('newUser deleted.');
  } catch (error) {
    console.log(error);
  } finally {
    console.log('App closed!');

    app.close();
  }
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
      expect(response.body.errors[0].message).toMatch('"email" is required');
    });

    test('should fail when email is invalid', async () => {
      user.email = 'invalid@notadomain';
      const response = await request(app)
        .post('/auth/login')
        .send(user)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toMatch('"email" must be a valid email');
    });

    test('should fail when email is too long (> 150 chars)', async () => {
      user.email = longText;
      const response = await request(app)
        .post('/auth/login')
        .send(user)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toMatch(
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
      expect(response.body.errors[0].message).toMatch('"password" is required');
    });

    test('should fail when password is less than 8 characters', async () => {
      user.password = '1234567';
      const response = await request(app)
        .post('/auth/login')
        .send(user)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toMatch(
        '"password" length must be at least 8 characters long'
      );
    });

    test('should fail when password is more than 150 characters', async () => {
      user.password = longText;
      const response = await request(app)
        .post('/auth/login')
        .send(user)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toMatch(
        '"password" length must be less than or equal to 150 characters long'
      );
    });
  });

  describe('Register endpoint tests', () => {
    test('should return a new user when valid creds are supplied', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(newUser)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({
        name: newUser.name,
        email: newUser.email
      });
    });
    test('should fail when name is blank', async () => {
      delete newUser.name;
      const response = await request(app)
        .post('/auth/register')
        .send(newUser)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toMatch('"name" is required');
    });
    test('should fail when email is blank', async () => {
      delete newUser.email;
      const response = await request(app)
        .post('/auth/register')
        .send(newUser)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toMatch('"email" is required');
    });
    test('should fail when password is blank', async () => {
      delete newUser.password;
      const response = await request(app)
        .post('/auth/register')
        .send(newUser)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');
      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toMatch('"password" is required');
    });
    test('should fail when passwordConfirmation is blank', async () => {
      delete newUser.password_confirmation;
      const response = await request(app)
        .post('/auth/register')
        .send(newUser)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');
      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toMatch('"password_confirmation" is required');
    });
    test('should fail when password is different from password_confirmation', async () => {
      newUser.password = 'different';
      const response = await request(app)
        .post('/auth/register')
        .send(newUser)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');
      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toMatch('Passwords do not match');
    });
    test('should fail when password is less than 8 characters', async () => {
      newUser.password = '1234567';
      const response = await request(app)
        .post('/auth/register')
        .send(newUser)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toMatch(
        '"password" length must be at least 8 characters long'
      );
    });

    test('should fail when password is more than 150 characters', async () => {
      newUser.password = longText;
      const response = await request(app)
        .post('/auth/register')
        .send(newUser)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toMatch(
        '"password" length must be less than or equal to 150 characters long'
      );
    });

    test('account verification should succeed when token is valid', async () => {
      const register = await request(app)
        .post('/auth/register')
        .send(newUser);

      const response = await request(app)
        .get(`/auth/verify/${register.body.verification_token}`)
        .expect('Content-Type', 'application/json; charset=utf-8');
      expect(response.status).toEqual(200);
      expect(response.body.message).toMatch('Account successfully activated.');
    });
    test('account verification should fail when token is invalid', async () => {
      await request(app)
        .post('/auth/register')
        .send(newUser);

      const response = await request(app)
        .get('/auth/verify/invalidtoken')
        .expect('Content-Type', 'application/json; charset=utf-8');
      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toMatch('Invalid token');
    });
    test('password reset should send a token when email is valid', async () => {
      const response = await request(app)
        .post('/auth/password/recover')
        .send({ email: user.email })
        .set('Content-Type', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8');
      expect(response.status).toEqual(200);
      expect(response.body.message).toMatch('A password reset link was sent to your email.');
      expect(response.body.token).not.toBeUndefined();
    });
  });
});

describe('Users Component Tests', () => {
  describe('Show User Endpoint Tests', () => {
    test('should return a user when param is valid', async () => {
      const response = await request(app)
        .get('/users/7')
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
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
      expect(response.body.errors[0].message).toMatch('"user" must be a number');
    });
  });
});
