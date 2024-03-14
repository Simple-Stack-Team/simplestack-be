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

  //IS OK
/*   it('/auth/signup (POST) SUCCESS', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'string3',
        email: 'string3@gmail.com',
        password: 'string',
        organizationName: 'string',
        headquarterAddress: 'string',
      })
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBeDefined();
      });
  }); */

  //********************ALERT********************
/*   it('/auth/signup (POST) 400 CONFLICT', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'string',
        email: 'string',
        password: 'string',
        organizationName: 'string',
        headquarterAddress: 'string',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBeDefined();
      });
  }); */

  it('/auth/signup (POST) 409 CONFLICT', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'string2',
        email: 'string2@gmail.com',
        password: 'string',
        organizationName: 'string',
        headquarterAddress: 'string',
      })
      .expect(409)
      .then((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  //IS OK
/*   it('/auth/{orgId}/signup (POST) SUCCESS', () => {
    return request(app.getHttpServer())
      .post('/auth/65e8d7d19177805d42a51cfb/signup')
      .send({
        name: 'string3',
        email: 'string3@string.com',
        password: 'string',
      })
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBeDefined();
      });
  }); */

  //********************ALERT********************
/*   it('/auth/{orgId}/signup (POST) 400 CONFLICT', () => {
    return request(app.getHttpServer())
      .post('/auth/65e8d7d19177805d42a51cfb/signup')
      .send({
        name: 'salut',
        email: 'salut',
        password: 'salut',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.error).toBeDefined();
      });
  }); */

  it('/auth/{orgId}/signup (POST) 409 CONFLICT', () => {
    return request(app.getHttpServer())
      .post('/auth/65e8d7d19177805d42a51cfb/signup')
      .send({
        name: 'string2',
        email: 'string2@string.com',
        password: 'string',
      })
      .expect(409)
      .then((res) => {
        expect(res.body.message).toBeDefined();
      });
  });
});