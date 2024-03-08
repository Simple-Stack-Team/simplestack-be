import { Module } from '@nestjs/common';

import { ProjectsService } from 'src/projects/projects.service';
import { ProjectsController } from 'src/projects/projects.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService],
})
export class ProjectsModule {}
