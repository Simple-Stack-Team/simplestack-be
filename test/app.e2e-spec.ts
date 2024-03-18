import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

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

  it('/auth/signup (POST) 201 USER CREATED', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'string31tq',
        email: 'string31tq@gmail.com',
        password: 'string',
        organizationName: 'string',
        headquarterAddress: 'string',
      })
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBeDefined();
      });
  });

  it('/auth/signup (POST) 400 INVALID BODY DATA', () => {
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
  });

  it('/auth/signup (POST) 409 USER ALREADY EXISTS', () => {
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

  it('/auth/{orgId}/signup (POST) 201 USER CREATED', () => {
    return request(app.getHttpServer())
      .post('/auth/65e8d7d19177805d42a51cfb/signup')
      .send({
        name: 'string3c1q',
        email: 'string3c1q@string.com',
        password: 'string',
      })
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBeDefined();
      });
  });

  it('/auth/{orgId}/signup (POST) 400 INVALID BODY DATA', () => {
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
  });

  it('/auth/{orgId}/signup (POST) 409 USER ALREADY EXISTS', () => {
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

  it('/organizations/{orgId}/employees (GET) 200 SUCCESS', () => {
    return request(app.getHttpServer())
      .get('/organizations/65e8d7d19177805d42a51cfb/employees')
      .expect(200)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .then((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('/organizations/{orgId}/employees (GET) 401 UNAUTHORIZED', () => {
    return request(app.getHttpServer())
      .get('/organizations/65e8d7d19177805d42a51cfb/employees')
      .expect(401)
      .then((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('/organizations/{orgId}/employees/{id}/employee (GET) 200 SUCCESS', () => {
    return request(app.getHttpServer())
      .get(
        '/organizations/65e8d7d19177805d42a51cfb/employees/65e8d86f9177805d42a51cff/employee',
      )
      .expect(200)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .then((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('/organizations/{orgId}/employees/{id}/employee (GET) 401 UNAUTHORIZED', () => {
    return request(app.getHttpServer())
      .get(
        '/organizations/65e8d7d19177805d42a51cfb/employees/65e8d86f9177805d42a51cff/employee',
      )
      .expect(401)
      .then((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('/organizations/{orgId}/employees/{id}/employee (GET) 404 NOT FOUND', () => {
    return request(app.getHttpServer())
      .get(
        '/organizations/65e8d7d19177805d42a51cfb/employees/65e8d86f9177805d42a51cfa/employee',
      )
      .expect(404)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .then((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('/organizations/{orgId}/employees/unassigned-employees (GET) 200 SUCCESS', () => {
    return request(app.getHttpServer())
      .get(
        '/organizations/65e8d7d19177805d42a51cfb/employees/unassigned-employees',
      )
      .expect(200)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .then((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('/organizations/{orgId}/employees/unassigned-employees (GET) 401 UNAUTHORIZED', () => {
    return request(app.getHttpServer())
      .get(
        '/organizations/65e8d7d19177805d42a51cfb/employees/unassigned-employees',
      )
      .expect(401)
      .then((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('/organizations/{orgId}/employees/unassigned-employees (GET) 404 NOT FOUND', () => {
    return request(app.getHttpServer())
      .get(
        '/organizations/65e8d7d19177805d42a51cfa/employees/unassigned-employees',
      )
      .expect(404)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .then((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('/organizations/{orgId}/employees/assign-roles/{id} (PUT) 404 NOT FOUND', () => {
    return request(app.getHttpServer())
      .put(
        '/organizations/65e8d7d19177805d42a51cfb/employees/assign-roles/65f2b9b24786f6ff231dd260',
      )
      .send({
        roles: ['EMPLOYEE', 'PROJECT_MANAGER'],
      })
      .expect(404)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .then((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('/organizations/{orgId}/teamroles (POST) 201 TEAM ROLE CREATED', () => {
    return request(app.getHttpServer())
      .post('/organizations/65e8d7d19177805d42a51cfb/teamroles')
      .send({
        name: 'Leader',
      })
      .expect(201)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .then((res) => {
        expect(res.body.id).toBeDefined();
      });
  });

  it('/organizations/{orgId}/teamroles (POST) 401 UNAUTHORIZED', () => {
    return request(app.getHttpServer())
      .post('/organizations/65e8d7d19177805d42a51cfb/teamroles')
      .send({
        name: 'Leader2',
      })
      .expect(401)
      .then((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('/organizations/{orgId}/teamroles (POST) 404 ORGANIZATION NOT FOUND', () => {
    return request(app.getHttpServer())
      .post('/organizations/65e8d7d19177805d42a51cfa/teamroles')
      .send({
        name: 'Leader',
      })
      .expect(404)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .then((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('/organizations/{orgId}/teamroles (GET) 200 ORGANIZATION TEAM ROLES LIST', () => {
    return request(app.getHttpServer())
      .get('/organizations/65e8d7d19177805d42a51cfb/teamroles')
      .expect(200)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .then((res) => {
        expect(res.body.teamRoles).toBeDefined();
      });
  });

  it('/organizations/{orgId}/teamroles (GET) 401 UNAUTHORIZED', () => {
    return request(app.getHttpServer())
      .get('/organizations/65e8d7d19177805d42a51cfb/teamroles')
      .expect(401)
      .then((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('/organizations/{orgId}/teamroles (GET) 404 ORGANIZATION NOT FOUND', () => {
    return request(app.getHttpServer())
      .get('/organizations/65e8d7d19177805d42a51cfa/teamroles')
      .expect(404)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .then((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('/organizations/{orgId}/teamroles/{teamroleId} (PUT) 401 UNAUTHORIZED', () => {
    return request(app.getHttpServer())
      .put(
        '/organizations/65e8d7d19177805d42a51cfb/teamroles/65f4ab7456229911af841266',
      )
      .send({
        name: 'Head of Java',
      })
      .expect(401)
      .then((res) => {
        expect(res.body.message).toBeDefined();
      });
  });
});
