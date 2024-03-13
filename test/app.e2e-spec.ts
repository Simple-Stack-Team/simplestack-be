import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
 
describe('AppController (e2e)', () => {
  let app: INestApplication;
 
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
 
    app = moduleFixture.createNestApplication();
    await app.init();
  });
 
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(404)
      .expect({ message: 'Cannot GET /', error: 'Not Found', statusCode: 404 });
  });
 
  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'l1@gmail.com',
        password: '1234',
      })
      .expect(200)
      .then((res) => {
        expect(res.body.access_token).toBeDefined();
      });
  });

  it('/auth/singup (POST) SUCCESS', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        "name": "string2",
        "email": "string2@gmail.com",
        "password": "string",
        "organizationName": "string",
        "headquarterAddress": "string"
      })
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBeDefined();
      });
  });

  it('/auth/singup (POST) CONFLICT', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        "name": "string1",
        "email": "string1@gmail.com",
        "password": "string",
        "organizationName": "string",
        "headquarterAddress": "string"
      })
      .expect(409)
      .then((res) => {
        expect(res.body.message).toBeDefined();
      });
  });
});