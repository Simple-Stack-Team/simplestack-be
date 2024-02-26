import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HelloWorldModule } from 'src/hello-world/hello-world.module';
import { HelloWorldController } from 'src/hello-world/controller/hello-world.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';

@Module({
  imports: [
    HelloWorldModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    AuthModule,
    EmployeesModule,
    OrganizationsModule,
  ],
  controllers: [HelloWorldController],
  providers: [PrismaService],
})
export class AppModule {}
