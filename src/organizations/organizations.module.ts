import { Module } from '@nestjs/common';

import { OrganizationsService } from 'src/organizations/organizations.service';
import { OrganizationsController } from 'src/organizations/organizations.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [OrganizationsService, PrismaService],
  controllers: [OrganizationsController],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
