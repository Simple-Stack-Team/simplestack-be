import { Module } from '@nestjs/common';

import { DepartmentsService } from 'src/departments/departments.service';
import { DepartmentsController } from 'src/departments/departments.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService, PrismaService],
})
export class DepartmentsModule {}
