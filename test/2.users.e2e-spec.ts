import { validationExceptionFactory } from '@app/common/factories/validation-exception.factory';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

const testUser1 = {
  firstName: 'test',
  lastName: 'user',
  email: 'test@v2x.network',
  password: '123123123',
  ethWalletAddress: '0x341dd37514340280a4035960c0a232d3757b55d5',
};

const testUser2 = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@test.com',
  password: '123123123',
  ethWalletAddress: '0x341dd37514340280a4035960c0a232d3757b55d5',
};

const testUser3 = {
  firstName: 'haku',
  lastName: 'test',
  email: 'test3@test.com',
  password: '123123123',
  ethWalletAddress: '0x341dd37514340280a4035960c0a232d3757b55d5',
};

describe('UsersController (e2e)', () => {
  let authToken = '';
  let testUserId = '';
  const randomUuid = '8aff59ce-a49a-468f-8e74-b3a28303f91c';
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      exceptionFactory: validationExceptionFactory,
    }));
    await app.init();

    // create a 2 test users
    const response = await request(app.getHttpServer()).post('/auth/signup').send(testUser1);
    testUserId = response.body.id;
    await request(app.getHttpServer()).post('/auth/signup').send(testUser3);
    // login with test user & get token
    authToken = (await request(app.getHttpServer()).post('/auth/login').send({
      email: 'test@v2x.network',
      password: '123123123',
    })).body.token;
    authToken = 'Bearer ' + authToken;
  });

  beforeEach(async () => {
    // drop databas
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('signup', () => {

    describe('invalid body', () => {

      it('should not able to signup without firstName in body', async () => {
        const tmpUser = Object.assign({}, testUser2);
        delete tmpUser.firstName;
        const response = await request(app.getHttpServer()).post('/auth/signup').send(tmpUser);
        expect(response.status).toEqual(400);
        expect(response.body.error).toEqual('validation_error');
      });

      it('should not able to signup without lastName in body', async () => {
        const tmpUser = Object.assign({}, testUser2);
        delete tmpUser.lastName;
        const response = await request(app.getHttpServer()).post('/auth/signup').send(tmpUser);
        expect(response.status).toEqual(400);
        expect(response.body.error).toEqual('validation_error');
      });

      describe('eth Address', () => {

        it('should not able to signup without ethWalletAddress in body', async () => {
          const tmpUser = Object.assign({}, testUser2);
          delete tmpUser.ethWalletAddress;
          const response = await request(app.getHttpServer()).post('/auth/signup').send(tmpUser);
          expect(response.status).toEqual(400);
          expect(response.body.error).toEqual('validation_error');
        });

        it('should not able to signup witwrong Eth Address in body (must be 42 character long', async () => {
          const tmpUser = Object.assign({}, testUser2);
          tmpUser.ethWalletAddress = '0x0';
          const response = await request(app.getHttpServer()).post('/auth/signup').send(tmpUser);
          expect(response.status).toEqual(400);
          expect(response.body.error).toEqual('validation_error');
        });
      });

      describe('email', () => {

        it('should not able to signup without email in body', async () => {
          const tmpUser = Object.assign({}, testUser2);
          delete tmpUser.email;
          const response = await request(app.getHttpServer()).post('/auth/signup').send(tmpUser);
          expect(response.status).toEqual(400);
          expect(response.body.error).toEqual('validation_error');
        });

        it('should not able to signup if provided email is not a valid email', async () => {
          const tmpUser = Object.assign({}, testUser2);
          tmpUser.email = 'wrong-email';
          const response = await request(app.getHttpServer()).post('/auth/signup').send(tmpUser);
          expect(response.status).toEqual(400);
          expect(response.body.error).toEqual('validation_error');
        });

        it('should not able to signup if email already exists', async () => {
          const tmpUser = Object.assign({}, testUser2);
          tmpUser.email = 'test@v2x.network';
          const response = await request(app.getHttpServer()).post('/auth/signup').send(tmpUser);
          expect(response.status).toEqual(400);
          expect(response.body.error).toEqual('email_already_exists');
        });
      });

      describe('password', () => {

        it('should not able to signup without password in body', async () => {
          const tmpUser = Object.assign({}, testUser2);
          delete tmpUser.password;
          const response = await request(app.getHttpServer()).post('/auth/signup').send(tmpUser);
          expect(response.status).toEqual(400);
          expect(response.body.error).toEqual('validation_error');
        });

        it('should not able to signup with a password less than 6 characters', async () => {
          const tmpUser = Object.assign({}, testUser2);
          tmpUser.password = 'aaa';
          const response = await request(app.getHttpServer()).post('/auth/signup').send(tmpUser);
          expect(response.status).toEqual(400);
          expect(response.body.error).toEqual('validation_error');
        });
      });

    });

    it('should be able to signup with correct details', async () => {
      const tmpUser = Object.assign({}, testUser2);
      const response = await request(app.getHttpServer()).post('/auth/signup').send(tmpUser);
      expect(response.status).toEqual(201);
      expect(response.body.id).toBeDefined();
    });

  });

  /**
   * Login
   */
  describe('login', () => {

    it('should reject login with wrong email', async () => {
      const response = await request(app.getHttpServer()).post('/auth/login').send({
        email: 'wrong@v2x.network',
        password: '123456',
      });
      expect(response.status).toEqual(401);
      expect(response.body.error).toEqual('unknown_user');
    });

    it('should reject login with correct email & wrong password', async () => {
      const response = await request(app.getHttpServer()).post('/auth/login').send({
        email: 'test@v2x.network',
        password: '123456',
      });
      expect(response.status).toEqual(401);
      expect(response.body.error).toEqual('Unauthorized');
    });

    it('should reject login without email in request body', async () => {
      const response = await request(app.getHttpServer()).post('/auth/login').send({
        password: '123456',
      });
      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual('validation_error');
    });

    it('should reject login without password in request body', async () => {
      const response = await request(app.getHttpServer()).post('/auth/login').send({
        email: 'test@v2x.network',
      });
      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual('validation_error');
    });

    it('should allow login on correct credentials', async () => {
      const response = await request(app.getHttpServer()).post('/auth/login').send({
        email: 'test@v2x.network',
        password: '123123123',
      });
      expect(response.status).toEqual(201);
      expect(response.body.token).toBeDefined();
    });

  });

  describe('GET /users', () => {

    it('should be able to get all users with valid auth token', async () => {
      const response = await request(app.getHttpServer()).get('/users').set('Authorization', authToken);
      expect(response.status).toEqual(200);
      expect(response.body.length).toBeGreaterThan(1);
    });

    it('should be not be able to get all users without auth token', async () => {
      const response = await request(app.getHttpServer()).get('/users');
      expect(response.status).toEqual(401);
      expect(response.body.error).toEqual('Unauthorized');
    });
  });

  describe('GET /users/:id', () => {

    it('should be able to get specific users with correct user id, provided a valid auth token', async () => {
      const response = await request(app.getHttpServer()).get('/users/' + testUserId).set('Authorization', authToken);
      expect(response.status).toEqual(200);
      expect(response.body.id).toBeDefined();
    });

    it('should not be able to get specific users with correct user id, without auth token', async () => {
      const response = await request(app.getHttpServer()).get('/users/' + testUserId);
      expect(response.status).toEqual(401);
    });

    it('should not be able to get specific users with wrong user id', async () => {
      const response = await request(app.getHttpServer()).get('/users/' + randomUuid).set('Authorization', authToken);
      expect(response.status).toEqual(404);
    });

  });

  describe('PUT /users/:id', () => {

    it('should be able to update user profile info', async () => {
      const response = await request(app.getHttpServer()).put('/users/' + testUserId).send({
        firstName: 'fname-updated',
        lastName: 'lname-updated',
      })
      .set('Authorization', authToken);
      expect(response.status).toEqual(200);
      expect(response.body.firstName).toEqual('fname-updated');
      expect(response.body.lastName).toEqual('lname-updated');
    });

    it('should not be able to update user email, if email is wrong', async () => {
      const response = await request(app.getHttpServer()).put('/users/' + testUserId).send({
        email: 'wrong-email',
      })
      .set('Authorization', authToken);
      expect(response.status).toEqual(400);
    });

    it('should not be able to update user email if new email belongs to other user', async () => {
      const response = await request(app.getHttpServer()).put('/users/' + testUserId).send({
        email: 'test3@test.com',
      })
      .set('Authorization', authToken);
      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual('email_already_exists');
    });

    describe('Password change', () => {

      it('should not be able to update password if user provides correct old password but an invalid new password', async () => {
        const response = await request(app.getHttpServer()).put('/users/' + testUserId).send({
          oldPassword: '123123123',
          newPassword: '123', // not meeting required length
        })
        .set('Authorization', authToken);
        expect(response.status).toEqual(400);
      });

      it('should not be able to update password if user provides incorrect old password', async () => {
        const response = await request(app.getHttpServer()).put('/users/' + testUserId).send({
          oldPassword: '123432',
          newPassword: '123123',
        })
        .set('Authorization', authToken);
        expect(response.status).toEqual(400);
      });

      it(`should be able to update password if user provides correct old & valid new password,
          and only be able to login with new password afterwards`, async () => {
        const newPass = '123123';
        let response = await request(app.getHttpServer()).put('/users/' + testUserId).send({
          oldPassword: testUser1.password,
          newPassword: newPass,
        })
        .set('Authorization', authToken);
        expect(response.status).toEqual(200);

        // login with old password shouldn't work anymore

        response = await request(app.getHttpServer()).post('/auth/login').send({
          email: testUser1.email,
          password: testUser1.password,
        });
        expect(response.status).toEqual(401);

        // login with new password must work
        response = await request(app.getHttpServer()).post('/auth/login').send({
          email: testUser1.email,
          password: newPass,
        });
        expect(response.status).toEqual(201);
      });

    });

  });

});
