import { Module } from '@nestjs/common';

import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService, PrismaService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
