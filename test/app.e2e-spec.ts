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

//   //**********************************************************************AUTH**********************************************************************
 
//   it('/auth/login (POST)', () => {
//     return request(app.getHttpServer())
//       .post('/auth/login')
//       .send({
//         email: 'l1@gmail.com',
//         password: '1234',
//       })
//       .expect(200)
//       .then((res) => {
//         expect(res.body.access_token).toBeDefined();
//       });
//   });

//   //IS OK
// /*   it('/auth/signup (POST) 201 USER CREATED', () => {
//     return request(app.getHttpServer())
//       .post('/auth/signup')
//       .send({
//         name: 'string3',
//         email: 'string3@gmail.com',
//         password: 'string',
//         organizationName: 'string',
//         headquarterAddress: 'string',
//       })
//       .expect(201)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   }); */

//   it('/auth/signup (POST) 400 INVALID BODY DATA', () => {
//     return request(app.getHttpServer())
//       .post('/auth/signup')
//       .send({
//         name: 'string',
//         email: 'string',
//         password: 'string',
//         organizationName: 'string',
//         headquarterAddress: 'string',
//       })
//       .expect(400)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/auth/signup (POST) 409 USER ALREADY EXISTS', () => {
//     return request(app.getHttpServer())
//       .post('/auth/signup')
//       .send({
//         name: 'string2',
//         email: 'string2@gmail.com',
//         password: 'string',
//         organizationName: 'string',
//         headquarterAddress: 'string',
//       })
//       .expect(409)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   //IS OK
// /*   it('/auth/{orgId}/signup (POST) 201 USER CREATED', () => {
//     return request(app.getHttpServer())
//       .post('/auth/65e8d7d19177805d42a51cfb/signup')
//       .send({
//         name: 'string3',
//         email: 'string3@string.com',
//         password: 'string',
//       })
//       .expect(201)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   }); */

//    it('/auth/{orgId}/signup (POST) 400 INVALID BODY DATA', () => {
//     return request(app.getHttpServer())
//       .post('/auth/65e8d7d19177805d42a51cfb/signup')
//       .send({
//         name: 'salut',
//         email: 'salut',
//         password: 'salut',
//       })
//       .expect(400)
//       .then((res) => {
//         expect(res.body.error).toBeDefined();
//       });
//   });

//   it('/auth/{orgId}/signup (POST) 409 USER ALREADY EXISTS', () => {
//     return request(app.getHttpServer())
//       .post('/auth/65e8d7d19177805d42a51cfb/signup')
//       .send({
//         name: 'string2',
//         email: 'string2@string.com',
//         password: 'string',
//       })
//       .expect(409)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   //**********************************************************************EMPLOYEES**********************************************************************

//   it('/organizations/{orgId}/employees (GET) 200 SUCCESS', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/employees')
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/employees (GET) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/employees')
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//     //********************ALERT********************
// /*   it('/organizations/{orgId}/employees (GET) 404 NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51caa/employees')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   }); */

//   it('/organizations/{orgId}/employees/{id}/employee (GET) 200 SUCCESS', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/employees/65e8d86f9177805d42a51cff/employee')
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/employees/{id}/employee (GET) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/employees/65e8d86f9177805d42a51cff/employee')
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/employees/{id}/employee (GET) 404 NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/employees/65e8d86f9177805d42a51cfa/employee')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/employees/unassigned-employees (GET) 200 SUCCESS', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/employees/unassigned-employees')
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/employees/unassigned-employees (GET) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/employees/unassigned-employees')
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/employees/unassigned-employees (GET) 404 NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfa/employees/unassigned-employees')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/employees/assign-roles/{id} (PUT) 200 SUCCESS', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/employees/assign-roles/65f2b9b24786f6ff231dd261')
//       .send({
//         roles: ["EMPLOYEE", "PROJECT_MANAGER"]
//       })
//       .expect(200||201)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/employees/assign-roles/{id} (PUT) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/employees/assign-roles/65f2b9b24786f6ff231dd261')
//       .send({
//         roles: ["EMPLOYEE", "PROJECT_MANAGER"]
//       })
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/employees/assign-roles/{id} (PUT) 404 NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/employees/assign-roles/65f2b9b24786f6ff231dd260')
//       .send({
//         roles: ["EMPLOYEE", "PROJECT_MANAGER"]
//       })
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//  //**********************************************************************ORGANIZATIONS**********************************************************************

// /*   it('/organizations/{orgId}/teamroles (POST) 201 TEAM ROLE CREATED', () => {
//     return request(app.getHttpServer())
//       .post('/organizations/65e8d7d19177805d42a51cfb/teamroles')
//       .send({
//         name: "Head of Java"
//       })
//       .expect(201)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   }); */

//   it('/organizations/{orgId}/teamroles (POST) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .post('/organizations/65e8d7d19177805d42a51cfb/teamroles')
//       .send({
//         name: "Head of Java"
//       })
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/teamroles (POST) 404 ORGANIZATION NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .post('/organizations/65e8d7d19177805d42a51cfa/teamroles')
//       .send({
//         name: "Head of Java"
//       })
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/teamroles (GET) 200 ORGANIZATION TEAM ROLES LIST', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/teamroles')
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.teamRoles).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/teamroles (GET) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/teamroles')
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/teamroles (GET) 404 ORGANIZATION NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfa/teamroles')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/teamroles/{teamroleId} (PUT) 200 ORGANIZATION TEAMROLE UPDATED', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/teamroles/65f4ab7456229911af841266')
//       .send({
//         name: "Head of Java"
//       })
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/teamroles/{teamroleId} (PUT) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/teamroles/65f4ab7456229911af841266')
//       .send({
//         name: "Head of Java"
//       })
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   //****************************************ALERT****************************************
//   it('/organizations/{orgId}/teamroles/{teamroleId} (PUT) 404 TEAM ROLE NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/teamroles/65eb5b2385fdf1de51939cda')
//       .send({
//         name: "Head of Java"
//       })
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/teamroles/{teamroleId} (DELETE) 201 ORGANIZATION TEAMROLES UPDATED', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65e8d7d19177805d42a51cfb/teamroles/65f4ac5668d457d23d21877b')
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/teamroles/{teamroleId} (DELETE) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65e8d7d19177805d42a51cfb/teamroles/65f4ac5668d457d23d21877b')
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   //****************************************ALERT****************************************
//   it('/organizations/{orgId}/teamroles/{teamroleId} (DELETE) 404 TEAM ROLE NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65e8d7d19177805d42a51cfb/teamroles/65eb5b2385fdf1de51939cda')
//       .send({
//         name: "Head of Java"
//       })
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//  //**********************************************************************DEPARTMENTS**********************************************************************

// /*   it('/organizations/{orgId}/departments (POST) 201 DEPARTMENT CREATED', () => {
//     return request(app.getHttpServer())
//       .post('/organizations/65e8d7d19177805d42a51cfb/departments')
//       .send({
//         name: "TESTtest"
//       })
//       .expect(201)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   }); */

//   it('/organizations/{orgId}/departments (POST) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .post('/organizations/65e8d7d19177805d42a51cfc/departments')
//       .send({
//         name: "TESTtest"
//       })
//       .expect(401)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   });

//   //****************************************ALERT****************************************
//   it('/organizations/{orgId}/departments (POST) 404 ORGANIZATION NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .post('/organizations/65e8d7d19177805d42a51cfb/departments')
//       .send({
//         name: "TESTtest"
//       })
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/departments (GET) 200 ORGANIZATION DEPARTMENTS LIST', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/departments')
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/departments (GET) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/departments')
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   // ****************************************ALERT****************************************
//   it('/organizations/{orgId}/departments (GET) 404 ORGANIZATION NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/departments')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/departments/{depId} (GET) 200 DEPARTMENT FOUND', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/departments/65f4bbefa4fd45a724f8b7d4')
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/departments/{depId} (GET) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/departments/65f4bbefa4fd45a724f8b7d4')
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/departments/{depId} (GET) 404 DEPARTMENT NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/departments/65f4bbefa4fd45a724f8b7d3')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

// /*   it('/organizations/{orgId}/departments/{depId} (DELETE) 200 DEPARTMENT DELETED', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65e8d7d19177805d42a51cfb/departments/65f4beba61d45628f80473b0')
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   }); */
  
//   it('/organizations/{orgId}/departments/{depId} (DELETE) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65e8d7d19177805d42a51cfb/departments/65f4bbefa4fd45a724f8b7d4')
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });
  
//   it('/organizations/{orgId}/departments/{depId} (DELETE) 404 DEPARTMENT NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65e8d7d19177805d42a51cfb/departments/65f4bbefa4fd45a724f8b7d3')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/departments/{depId} (PUT) 200 DEPARTMENT UPDATED', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/departments/65f4bbe6a4fd45a724f8b7d2')
//       .send({ 
//         name: 'Updated Department Name' 
//       })
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         // Check if the updated department name is returned in the response
//         expect(res.body.name).toEqual('Updated Department Name');
//       });
//   });

//   it('/organizations/{orgId}/departments/{depId} (PUT) 400 INVALID BODY', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/departments/65f4bbe6a4fd45a724f8b7d2')
//       .send({ 
//       })
//       .expect(400)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });
  
//   it('/organizations/{orgId}/departments/{depId} (PUT) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/departments/65f4bbefa4fd45a724f8b7d4')
//       .send({ 
//         name: 'Updated Department Name' 
//       })
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   // ****************************************ALERT****************************************
//   it('/organizations/{orgId}/departments/{depId} (PUT) 404 DEPARTMENT NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/departments/65f4bbefa4fd45a724f8b7d3')
//       .send({ 
//         name: 'Updated Department Name' 
//       })
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

// /*   it('/organizations/{orgId}/departments/{depId}/assign-manager/{depManagerId} (PUT) 200 SUCCESS ASSIGNING MANAGER', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/departments/65f4c2046e249ee3b373d429/assign-manager/65f2b9b24786f6ff231dd261')
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   }); */

//   it('/organizations/{orgId}/departments/{depId}/assign-manager/{depManagerId} (PUT) 404 EMPLOYEE NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/departments/65f4c2046e249ee3b373d429/assign-manager/65f2c6652d64bd8d73cfc28a')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/departments/{depId}/assign-manager/{depManagerId} (PUT) 409 ALREADY A MANAGER', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/departments/65f4c2046e249ee3b373d429/assign-manager/65f2c6652d64bd8d73cfc28e')
//       .expect(409)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });
 
//   it('/organizations/{orgId}/departments/{depId}/assign-member/{empId} (PUT) 200 SUCCESS ASSIGN EMP TO DEP', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/departments/65f4c2046e249ee3b373d429/assign-member/65e8d8639177805d42a51cfe')
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/departments/{depId}/assign-member/{empId} (PUT) 404 DEP/EMP NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/departments/65f4c2046e249ee3b373d422/assign-member/65e8d8639177805d42a51cff')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

// /*   it('/organizations/{orgId}/departments/{depId}/delete-member/{empId} (DELETE) 200 SUCCESS REMOVE EMP FROM DEP', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65e8d7d19177805d42a51cfb/departments/65f4c2046e249ee3b373d429/delete-member/65e8d8639177805d42a51cfe')
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   }); */
  
//   it('/organizations/{orgId}/departments/{depId}/delete-member/{empId} (DELETE) 404 DEP/EMP NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65e8d7d19177805d42a51cfb/departments/65f4c2046e249ee3b373d422/delete-member/65e8d8639177805d42a51cff')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

// it('/organizations/{orgId}/departments/{depId}/members (GET) 200 LIST OF DEP MEMBERS', () => {
//   return request(app.getHttpServer())
//     .get('/organizations/65e8d7d19177805d42a51cfb/departments/65f4c2046e249ee3b373d429/members')
//     .expect(200)
//     .set('Authorization', `Bearer ${process.env.TOKEN}`)
//     .then((res) => {
//       expect(res.body.id).toBeDefined();
//     });
// });

//   it('/organizations/{orgId}/departments/{depId}/members (GET) 404 DEPARTMENT NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/departments/65f4c2046e249ee3b373d422/members')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

});