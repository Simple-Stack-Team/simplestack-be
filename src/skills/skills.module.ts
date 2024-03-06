import { Module } from '@nestjs/common';

import { SkillsController } from 'src/skills/skills.controller';
import { SkillsService } from 'src/skills/skills.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SkillsController],
  providers: [SkillsService, PrismaService],
})
export class SkillsModule {}
