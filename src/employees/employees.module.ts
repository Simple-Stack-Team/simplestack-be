import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { EmployeesService } from 'src/employees/employees.service';
import { EmployeesController } from 'src/employees/employees.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Module({
  controllers: [EmployeesController],
  providers: [
    EmployeesService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [EmployeesService],
})
export class EmployeesModule {}
