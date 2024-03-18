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

// /*   it('/organizations/{orgId}/skills/skill-category (POST) 201 SKILL CATEGORY CREATED', () => {
//     return request(app.getHttpServer())
//       .post('/organizations/65e8d7d19177805d42a51cfb/skills/skill-category')
//       .expect(201)
//       .send({
//         name: 'test',
//       })
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   }); */

  // it('/organizations/{orgId}/skills/skill-category (POST) 401 UNAUTHORIZED', () => {
  //   return request(app.getHttpServer())
  //     .post('/organizations/65e8d7d19177805d42a51cfb/skills/skill-category')
  //     .expect(401)
  //     .send({
  //       name: 'test',
  //     })
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/skill-category (POST) 404 ORGANIZATION NOT FOUND', () => {
  //   return request(app.getHttpServer())
  //     .post('/organizations/65e8d7d19177805d42a51cfa/skills/skill-category')
  //     .expect(404)
  //     .send({
  //       name: 'test',
  //     })
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

//   it('/organizations/{orgId}/skills/skill-category (GET) 200 ORG SKILL CATEGORIES LIST', () => {
//   return request(app.getHttpServer())
//     .get('/organizations/65e8d7d19177805d42a51cfb/skills/skill-categories')
//     .expect(200)
//     .set('Authorization', `Bearer ${process.env.TOKEN}`)
//     .then((res) => {
//       expect(res.body).toBeDefined();
//     });
//   });

// it('/organizations/{orgId}/skills/skill-category (GET) 401 UNAUTHORIZED', () => {
//   return request(app.getHttpServer())
//     .get('/organizations/65e8d7d19177805d42a51cfb/skills/skill-categories')
//     .expect(401)
//     .then((res) => {
//       expect(res.body.message).toBeDefined();
//     });
// });

// it('/organizations/{orgId}/skills/skill-category (GET) 404 ORGANIZATION NOT FOUND', () => {
//   return request(app.getHttpServer())
//     .get('/organizations/65e8d7d19177805d42a51cfa/skills/skill-categories')
//     .expect(404)
//     .set('Authorization', `Bearer ${process.env.TOKEN}`)
//     .then((res) => {
//       expect(res.body.message).toBeDefined();
//     });
// });

  // it('/organizations/{orgId}/skills (GET) 200 ORGANIZATION SKILLS LIST', () => {
  //   return request(app.getHttpServer())
  //     .get('/organizations/65e8d7d19177805d42a51cfb/skills')
  //     .expect(200)
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills (GET) 401 UNAUTHORIZED', () => {
  //   return request(app.getHttpServer())
  //     .get('/organizations/65e8d7d19177805d42a51cfb/skills')
  //     .expect(401)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills (GET) 404 ORGANIZATION NOT FOUND', () => {
  //   return request(app.getHttpServer())
  //     .get('/organizations/65e8d7d19177805d42a51cfa/skills')
  //     .expect(404)
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/{skillId} (GET) 200 SKILL DETAILS', () => {
  //   return request(app.getHttpServer())
  //     .get('/organizations/65e8d7d19177805d42a51cfb/skills/65ecd6e34504b42876f655bf')
  //     .expect(200)
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.id).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/{skillId} (GET) 401 UNAUTHORIZED', () => {
  //   return request(app.getHttpServer())
  //     .get('/organizations/65e8d7d19177805d42a51cfb/skills/65ecd6e34504b42876f655bf')
  //     .expect(401)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/{skillId} (GET) 404 SKILL NOT FOUND', () => {
  //   return request(app.getHttpServer())
  //     .get('/organizations/65e8d7d19177805d42a51cfa/skills/65ecd6e34504b42876f655be')
  //     .expect(404)
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/skill-category/update/{categoryId} (PUT) 200 SKILL CATEGORY UPDATED', () => {
  //   return request(app.getHttpServer())
  //     .put('/organizations/65e8d7d19177805d42a51cfb/skills/skill-category/update/65f6b52bcffa22d26d8a0f6c')
  //     .expect(200)
  //     .send({
  //       name: "testtesttest",
  //     })
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.id).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/skill-category/update/{categoryId} (PUT) 401 UNAUTHORIZED', () => {
  //   return request(app.getHttpServer())
  //     .put('/organizations/65e8d7d19177805d42a51cfb/skills/skill-category/update/65f6b52bcffa22d26d8a0f6c')
  //     .expect(401)
  //     .send({
  //       name: "testtesttest",
  //     })
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/skill-category/update/{categoryId} (PUT) 404 CATEGORY NOT FOUND', () => {
  //   return request(app.getHttpServer())
  //     .put('/organizations/65e8d7d19177805d42a51cfb/skills/skill-category/update/65f6aee6c293c8c0367ea7f1')
  //     .expect(404)
  //     .send({
  //       name: "testtesttest",
  //     })
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/skill-category/delete/{categoryId} (DELETE) 200 SKILL CATEGORY DELETED', () => {
  //   return request(app.getHttpServer())
  //     .delete('/organizations/65e8d7d19177805d42a51cfa/skills/skill-category/delete/65f6b4f9cffa22d26d8a0f6b')
  //     .expect(200)
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.id).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/skill-category/delete/{categoryId} (DELETE) 401 UNAUTHORIZED', () => {
  //   return request(app.getHttpServer())
  //     .delete('/organizations/65e8d7d19177805d42a51cfa/skills/skill-category/delete/65f6b4f9cffa22d26d8a0f6b')
  //     .expect(401)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/skill-category/delete/{categoryId} (DELETE) 404 CATEGORY NOT FOUND', () => {
  //   return request(app.getHttpServer())
  //     .delete('/organizations/65e8d7d19177805d42a51cfa/skills/skill-category/delete/65f6aee6c293c8c0367ea7f1')
  //     .expect(404)
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/create-skill/{authorId} (POST) 201 SKILL CREATED', () => {
  //   return request(app.getHttpServer())
  //     .post('/organizations/65e8d7d19177805d42a51cfb/skills/create-skill/65f2be8ff668194601ede051')
  //     .expect(201)
  //     .send({
  //       skillCategoryId: '65f6b52bcffa22d26d8a0f6c',
  //       description: 'string',
  //       name: 'ADD SKILL TEST',
  //     })
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.id).toBeDefined();
  //     });
  // });
  
  // it('/organizations/{orgId}/skills/create-skill/{authorId} (POST) 401 UNAUTHORIZED', () => {
  //   return request(app.getHttpServer())
  //     .post('/organizations/65e8d7d19177805d42a51cfb/skills/create-skill/65f2be8ff668194601ede051')
  //     .expect(401)
  //     .send({
  //       skillCategoryId: '65f6b52bcffa22d26d8a0f6c',
  //       description: 'string',
  //       name: 'strin',
  //     })
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });
  
  // it('/organizations/{orgId}/skills/create-skill/{authorId} (POST) 404 SKILL CAT OR EMP NOT FOUND', () => {
  //   return request(app.getHttpServer())
  //     .post('/organizations/65e8d7d19177805d42a51cfb/skills/create-skill/65f2be8ff668194601ede050')
  //     .expect(404)
  //     .send({
  //       skillCategoryId: '65f6b52bcffa22d26d8a0f6b',
  //       description: 'string',
  //       name: 'strin',
  //     })
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });
  
  // it('/organizations/{orgId}/skills/update-skill/{skillId}/author/{authorId} (PUT) 201 SKILL UPDATED', () => {
  //   return request(app.getHttpServer())
  //     .put('/organizations/65e8d7d19177805d42a51cfb/skills/update-skill/65f6bbec6649c6ae1f41f905/author/65f2be8ff668194601ede051')
  //     .expect(200||201)
  //     .send({
  //       skillCategoryId: '65f6b52bcffa22d26d8a0f6b',
  //       description: 'description updated',
  //       name: 'SKILL FOR TEST UPDATED',
  //     })
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.id).toBeDefined();
  //     });
  // });
  
  // it('/organizations/{orgId}/skills/update-skill/{skillId}/author/{authorId} (PUT) 401 UNAUTHORIZED', () => {
  //   return request(app.getHttpServer())
  //     .put('/organizations/65e8d7d19177805d42a51cfb/skills/update-skill/65f6bbec6649c6ae1f41f905/author/65f2be8ff668194601ede051')
  //     .expect(401)
  //     .send({
  //       skillCategoryId: '65f6b52bcffa22d26d8a0f6b',
  //       description: 'description updated',
  //       name: 'SKILL FOR TEST UPDATED',
  //     })
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });
  
  // it('/organizations/{orgId}/skills/update-skill/{skillId}/author/{authorId} (PUT) 404 SKILL NOT FOUND', () => {
  //   return request(app.getHttpServer())
  //     .put('/organizations/65e8d7d19177805d42a51cfb/skills/update-skill/65f6bbec6649c6ae1f41f904/author/65f2be8ff668194601ede051')
  //     .expect(404)
  //     .send({
  //       skillCategoryId: '65f6b52bcffa22d26d8a0f6a',
  //       description: 'description updated',
  //       name: 'SKILL FOR TEST UPDATED',
  //     })
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/update-skill/{skillId}/author/{authorId} (PUT) 409 NO RIGHTS', () => {
  //   return request(app.getHttpServer())
  //     .put('/organizations/65e8d7d19177805d42a51cfb/skills/update-skill/65f6bbec6649c6ae1f41f905/author/65e8d7d29177805d42a51cfc')
  //     .expect(409)
  //     .send({
  //       skillCategoryId: '65f6b52bcffa22d26d8a0f6b',
  //       description: 'description updated',
  //       name: 'SKILL FOR TEST UPDATED',
  //     })
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

// /*   it('/organizations/{orgId}/skills/delete-skill/{skillId}/author/{authorId} (DELETE) 200 SKILL DELETED', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65e8d7d19177805d42a51cfb/skills/delete-skill/65f6df128418bda466542468/author/65ef579f9ab046cfa6883cc3')
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   }); */

//   it('/organizations/{orgId}/skills/delete-skill/{skillId}/author/{authorId} (DELETE) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65e8d7d19177805d42a51cfb/skills/delete-skill/65ecd6e34504b42876f655bf/author/65ef579f9ab046cfa6883cc3')
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/skills/delete-skill/{skillId}/author/{authorId} (DELETE) 409 NO RIGHTS', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65e8d7d19177805d42a51cfb/skills/delete-skill/65ec835ccacca99e91223ae2/author/65ecc5bd4504b42876f655b5')
//       .expect(403)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/skills/delete-skill/{skillId}/author/{authorId} (DELETE) 404 SKILL NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65e8d7d19177805d42a51cfb/skills/delete-skill/65ecd6e34504b42876f655bf/author/65ef579f9ab046cfa6883cc3')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

  // it('/organizations/{orgId}/skills/assign-skill-to-department/{skillId}/department/{depId}/manager/{managerId} (PUT) 200 SKILL ASSIGNED', () => {
  //   return request(app.getHttpServer())
  //     .put('/organizations/65e8d7d19177805d42a51cfb/skills/assign-skill-to-department/65ec835ccacca99e91223ae2/department/65f4bb83a4fd45a724f8b7cd/manager/65ef7b9b9164bec6d6a214fe')
  //     .expect(200)
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.id).toBeDefined();
  //     });
  // });

//   it('/organizations/{orgId}/skills/assign-skill-to-department/{skillId}/department/{depId}/manager/{managerId} (PUT) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/skills/assign-skill-to-department/65ec835ccacca99e91223ae2/department/65f4bb83a4fd45a724f8b7cd/manager/65ef7b9b9164bec6d6a214fe')
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/skills/assign-skill-to-department/{skillId}/department/{depId}/manager/{managerId} (PUT) 403 NO RIGHTS', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/skills/assign-skill-to-department/65ec835ccacca99e91223ae2/department/65f4bb83a4fd45a724f8b7cd/manager/65e8d7d19177805d42a51cfb')
//       .expect(403)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/skills/assign-skill-to-department/{skillId}/department/{depId}/manager/{managerId} (PUT) 404 DEP OR SKILL NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/skills/assign-skill-to-department/65ec835ccacca99e91223ae1/department/65f4bb83a4fd45a724f8b7ca/manager/65e8d7d19177805d42a51cfb')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/skills/assign-skill-to-department/{skillId}/department/{depId}/manager/{managerId} (PUT) 409 SKILL ALREADY ASSIGNED', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/skills/assign-skill-to-department/65ec835ccacca99e91223ae2/department/65f4bb83a4fd45a724f8b7cd/manager/65ef7b9b9164bec6d6a214fe')
//       .expect(409)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

  // it('/organizations/{orgId}/skills/delete-skill-from-department/{skillId}/department/{depId}/manager/{managerId} (PUT) 200 SKILL UNASSIGNED', () => {
  //   return request(app.getHttpServer())
  //     .put('/organizations/65e8d7d19177805d42a51cfb/skills/delete-skill-from-department/65ec835ccacca99e91223ae2/department/65f4bb83a4fd45a724f8b7cd/manager/65ef7b9b9164bec6d6a214fe')
  //     .expect(200)
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.id).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/delete-skill-from-department/{skillId}/department/{depId}/manager/{managerId} (PUT) 401 UNAUTHORIZED', () => {
  //   return request(app.getHttpServer())
  //     .put('/organizations/65e8d7d19177805d42a51cfb/skills/delete-skill-from-department/65ec835ccacca99e91223ae2/department/65f4bb83a4fd45a724f8b7cd/manager/65ef7b9b9164bec6d6a214fe')
  //     .expect(401)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/delete-skill-from-department/{skillId}/department/{depId}/manager/{managerId} (PUT) 403 NO RIGHTS', () => {
  //   return request(app.getHttpServer())
  //     .put('/organizations/65e8d7d19177805d42a51cfb/skills/delete-skill-from-department/65ec835ccacca99e91223ae2/department/65f4bb83a4fd45a724f8b7cd/manager/65e8d7d19177805d42a51cfb')
  //     .expect(403)
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/delete-skill-from-department/{skillId}/department/{depId}/manager/{managerId} (PUT) 404 DEP OR SKILL NOT FOUND', () => {
  //   return request(app.getHttpServer())
  //     .put('/organizations/65e8d7d19177805d42a51cfb/skills/delete-skill-from-department/65ec835ccacca99e91223ae1/department/65f4bb83a4fd45a724f8b7ca/manager/65e8d7d19177805d42a51cfb')
  //     .expect(404)
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/delete-skill-from-department/{skillId}/department/{depId}/manager/{managerId} (PUT) 409 DEP DONT COTAIN SKILL', () => {
  //   return request(app.getHttpServer())
  //     .put('/organizations/65e8d7d19177805d42a51cfb/skills/delete-skill-from-department/65ec835ccacca99e91223ae2/department/65f4bb83a4fd45a724f8b7cd/manager/65ef7b9b9164bec6d6a214fe')
  //     .expect(409)
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/assign-skill (POST) 201 SKILL ASSIGNED', () => {
  //   return request(app.getHttpServer())
  //     .post('/organizations/65e8d7d19177805d42a51cfb/skills/assign-skill')
  //     .expect(201)
  //     .send({
  //       employeeId: '65eb258585fdf1de51939cd9',
  //       skillId: '65ef6a2a47c6cdb201882b6c',
  //       level: 2,
  //       experience: '0-6 months'
  //     })
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.id).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/assign-skill (POST) 401 UNAUTHORIZED', () => {
  //   return request(app.getHttpServer())
  //     .post('/organizations/65e8d7d19177805d42a51cfb/skills/assign-skill')
  //     .expect(401)
  //     .send({
  //       employeeId: '65eb258585fdf1de51939cd9',
  //       skillId: '65ef6a2a47c6cdb201882b6c',
  //       level: 2,
  //       experience: '0-6 months'
  //     })
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/assign-skill (POST) 404 EMP OR SKILL NOT FOUND', () => {
  //   return request(app.getHttpServer())
  //     .post('/organizations/65e8d7d19177805d42a51cfb/skills/assign-skill')
  //     .expect(404)
  //     .send({
  //       employeeId: '65eb258585fdf1de51939cd8',
  //       skillId: '65ef6a2a47c6cdb201882b6b',
  //       level: 2,
  //       experience: '0-6 months'
  //     })
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

// /*   it('/organizations/{orgId}/skills/delete-skill-from-employee/{assignmentId}/employee/{employeeId} (DELETE) 200 SKILL UNASSIGNED', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65eb258485fdf1de51939cd8/skills/delete-skill-from-employee/65f07ba35dfd1274bd902b12/employee/65eb258585fdf1de51939cd9')
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   }); */

  // it('/organizations/{orgId}/skills/delete-skill-from-employee/{assignmentId}/employee/{employeeId} (DELETE) 401 UNAUTHORIZED', () => {
  //   return request(app.getHttpServer())
  //     .delete('/organizations/65eb258485fdf1de51939cd8/skills/delete-skill-from-employee/65f07ba35dfd1274bd902b12/employee/65eb258585fdf1de51939cd9')
  //     .expect(401)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/skills/delete-skill-from-employee/{assignmentId}/employee/{employeeId} (DELETE) 404 ASSIGN OR EMP NOT FOUND', () => {
  //   return request(app.getHttpServer())
  //     .delete('/organizations/65eb258485fdf1de51939cd8/skills/delete-skill-from-employee/65f07ba35dfd1274bd902b12/employee/65eb258585fdf1de51939cd9')
  //     .expect(404)
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

//   it('/organizations/{orgId}/skills/department/{depId}/manager/{managerId} (GET) 200 SKILL STATISTICS', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/skills/department/65f4bbeaa4fd45a724f8b7d3/manager/65e8d7d29177805d42a51cfc')
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/skills/department/{depId}/manager/{managerId} (GET) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/skills/department/65f4bbeaa4fd45a724f8b7d3/manager/65e8d7d29177805d42a51cfc')
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });
//   // ****************************************ALERT****************************************
// /*   it('/organizations/{orgId}/skills/department/{depId}/manager/{managerId} (GET) 403 FORBIDDEN', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/skills/department/65f4bbeaa4fd45a724f8b7d3/manager/65f2b9b24786f6ff231dd261')
//       .expect(403)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   }); */
  
//   it('/organizations/{orgId}/skills/department/{depId}/manager/{managerId} (GET) 404 NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/skills/department/65f4bbeaa4fd45a724f8b7d3/manager/65e8d7d29177805d42a51cfe')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

  // it('/organizations/{orgId}/projects/manager (GET) 200 PROJECT MANAGER PROJECTS', () => {
  //   return request(app.getHttpServer())
  //     .get('/organizations/{orgId}/projects/manager')
  //     .expect(200)
  //     .set('Authorization', `Bearer ${process.env.TOKEN}`)
  //     .then((res) => {
  //       expect(res.body).toBeDefined();
  //     });
  // });

  // it('/organizations/{orgId}/projects/manager (GET) 401 UNAUTHORIZED', () => {
  //   return request(app.getHttpServer())
  //     .get('/organizations/{orgId}/projects/manager')
  //     .expect(401)
  //     .then((res) => {
  //       expect(res.body).toBeDefined();
  //     });
  // });

// /*   it('/organizations/{orgId}/projects (POST) 201 PROJECT CREATED', () => {
//     return request(app.getHttpServer())
//       .post('/organizations/65e8d7d19177805d42a51cfb/projects')
//       .expect(201)
//       .send({
//         name: 'TEST TS TEST',
//         period: 'Fixed',
//         startDate: '2024-04-05T14:48:00.000Z',
//         deadlineDate: '2024-10-05T14:48:00.000Z',
//         status: 'Starting',
//         description: 'string',
//         technologyStack: [
//           'Frontend'
//         ],
//         teamRoles: [
//           {
//             teamroleId: '65ecced04504b42876f655bb',
//             nrOfMembers: 1
//           }
//         ]
//       })
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   }); */
  
//   it('/organizations/{orgId}/projects (POST) 400 INVALID DATA', () => {
//     return request(app.getHttpServer())
//       .post('/organizations/65e8d7d19177805d42a51cfb/projects')
//       .expect(400)
//       .send({
//         name: 'TEST TS TEST',
//         period: 'string',
//         startDate: '2024-04-05T14:48:00.000Z',
//         deadlineDate: '2024-10-05T14:48:00.000Z',
//         status: 'Starting',
//         description: 'string',
//         technologyStack: [
//           'Frontend'
//         ],
//         teamRoles: [
//           {
//             teamroleId: '65ecced04504b42876f655bb',
//             nrOfMembers: 1
//           }
//         ]
//       })
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/projects (POST) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .post('/organizations/65e8d7d19177805d42a51cfb/projects')
//       .expect(401)
//       .send({
//         name: 'TEST TS TEST',
//         period: 'Fixed',
//         startDate: '2024-04-05T14:48:00.000Z',
//         deadlineDate: '2024-10-05T14:48:00.000Z',
//         status: 'Starting',
//         description: 'string',
//         technologyStack: [
//           'Frontend'
//         ],
//         teamRoles: [
//           {
//             teamroleId: '65ecced04504b42876f655bb',
//             nrOfMembers: 1
//           }
//         ]
//       })
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });


//   it('/organizations/{orgId}/projects (POST) 404 ORGANIZATION NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .post('/organizations/65e8d7d19177805d42a51cfa/projects')
//       .expect(404)
//       .send({
//         name: 'TEST TS TEST',
//         period: 'Fixed',
//         startDate: '2024-04-05T14:48:00.000Z',
//         deadlineDate: '2024-10-05T14:48:00.000Z',
//         status: 'Starting',
//         description: 'string',
//         technologyStack: [
//           'Frontend'
//         ],
//         teamRoles: [
//           {
//             teamroleId: '65ecced04504b42876f655bb',
//             nrOfMembers: 1
//           }
//         ]
//       })
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/projects/{projectId} (GET) 200 OK', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/projects/65f7f4c57864b4e0ada6e0b8')
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/projects/{projectId} (GET) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/projects/65f7f4c57864b4e0ada6e0b8')
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/projects/{projectId} (GET) 404 NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .get('/organizations/65e8d7d19177805d42a51cfb/projects/65f7f4c57864b4e0ada6e0b7')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/projects/{projectId} (PUT) 200 OK', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/projects/65f7f4c57864b4e0ada6e0b8')
//       .send({
//         name: 'TEST NAME UPDATED',
//         period: 'Fixed',
//         startDate: '2024-04-05T14:48:00.000Z',
//         deadlineDate: '2024-10-05T14:48:00.000Z',
//         status: 'Starting',
//         description: 'string',
//         technologyStack: [
//           'Frontend'
//         ],
//         teamRoles: [
//           {
//             teamroleId: '65ecced04504b42876f655bb',
//             nrOfMembers: 1
//           }
//         ]
//       })
//       .expect(200)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/projects/{projectId} (PUT) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/projects/65f7f4c57864b4e0ada6e0b8')
//       .send({
//         name: 'TEST NAME UPDATED',
//         period: 'Fixed',
//         startDate: '2024-04-05T14:48:00.000Z',
//         deadlineDate: '2024-10-05T14:48:00.000Z',
//         status: 'Starting',
//         description: 'string',
//         technologyStack: [
//           'Frontend'
//         ],
//         teamRoles: [
//           {
//             teamroleId: '65ecced04504b42876f655bb',
//             nrOfMembers: 1
//           }
//         ]
//       })
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   it('/organizations/{orgId}/projects/{projectId} (PUT) 404 NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .put('/organizations/65e8d7d19177805d42a51cfb/projects/65f7f4c57864b4e0ada6e0b7')
//       .send({
//         name: 'TEST NAME UPDATED',
//         period: 'Fixed',
//         startDate: '2024-04-05T14:48:00.000Z',
//         deadlineDate: '2024-10-05T14:48:00.000Z',
//         status: 'Starting',
//         description: 'string',
//         technologyStack: [
//           'Frontend'
//         ],
//         teamRoles: [
//           {
//             teamroleId: '65ecced04504b42876f655bb',
//             nrOfMembers: 1
//           }
//         ]
//       })
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

// /*   it('/organizations/{orgId}/projects/{projectId} (DELETE) 200 OK', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65e8d7d19177805d42a51cfb/projects/65f7f4c57864b4e0ada6e0b8')
//       .expect(200)
//       .then((res) => {
//         expect(res.body.id).toBeDefined();
//       });
//   }); */

//   it('/organizations/{orgId}/projects/{projectId} (DELETE) 401 UNAUTHORIZED', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65e8d7d19177805d42a51cfb/projects/65f7f4c57864b4e0ada6e0b8')
//       .expect(401)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   });

//   // ****************************************ALERT****************************************
// /*   it('/organizations/{orgId}/projects/{projectId} (DELETE) 404 NOT FOUND', () => {
//     return request(app.getHttpServer())
//       .delete('/organizations/65e8d7d19177805d42a51cfb/projects/65f7f4c57864b4e0ada6e0b7')
//       .expect(404)
//       .set('Authorization', `Bearer ${process.env.TOKEN}`)
//       .then((res) => {
//         expect(res.body.message).toBeDefined();
//       });
//   }); */


});