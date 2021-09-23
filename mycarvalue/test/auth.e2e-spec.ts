import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dtos/create-user.dto';

describe('Authentication system (e2e)', () => {
  const signupUser: CreateUserDto = { email: 'tito@test.com', password: 'totopass' }
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {

  })

  it('signs up a new user', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupUser)
      .expect(201)
      .then(res => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toBe(signupUser.email);
      });
  });

  it('signs up a new user and gets currently logged in user', async () => {
    const server = request(app.getHttpServer());
    const res = await server
      .post('/auth/signup')
      .send(signupUser)
      .expect(201)
      .expect(res => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toBe(signupUser.email);
      });

    const cookie = res.get('Set-Cookie');

    const { body } = await server.get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    const { id, email } = body;
    expect(id).toBeDefined();
    return expect(email).toBe(signupUser.email);
  });
});
