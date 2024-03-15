import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { DepartmentsModule } from 'src/departments/departments.module';
import { SkillsModule } from 'src/skills/skills.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    AuthModule,
    EmployeesModule,
    OrganizationsModule,
    DepartmentsModule,
    SkillsModule,
    ProjectsModule,
    OpenaiModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
