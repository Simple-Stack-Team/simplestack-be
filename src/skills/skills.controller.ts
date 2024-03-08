import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { SkillsDto } from 'src/skills/dto/create-updates-skills.dto';
import { SkillCategoryDto } from 'src/skills/dto/skill-category.dto';
import { Role } from 'src/auth/types/role.types';
import { SkillsService } from 'src/skills/skills.service';
import { AssignSkillDto } from 'src/skills/dto/assign-skill.dto';

@Controller('organizations/:orgId/skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Post('SkillCategory')
  async createSkillCategory(
    @Param('orgId') orgId: string,
    @Body() data: SkillCategoryDto,
  ) {
    return await this.skillsService.createSkillCategory(orgId, data.name);
  }

  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Get('SkillCategories')
  async getSkillsCategories(@Param('orgId') orgId: string) {
    return await this.skillsService.getSkillsCategories(orgId);
  }

  @Roles(Role.EMPLOYEE)
  @Get()
  async getSkills(@Param('orgId') orgId: string) {
    return await this.skillsService.getSkills(orgId);
  }

  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Put('SkillCategory/update/:categorySkillId')
  async updateSkillCategory(
    @Param('categorySkillId') id: string,
    @Body() data: SkillCategoryDto,
  ) {
    return await this.skillsService.updateSkillCategory(id, data.name);
  }

  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Delete('SkillCategory/delete/:categorySkillId')
  async deleteSkillCategory(@Param('categorySkillId') id: string) {
    return await this.skillsService.deleteSkillCategory(id);
  }

  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Post('create-skill/:authorId')
  async createSkill(
    @Param('orgId') orgId: string,
    @Param('authorId') authorId: string,
    @Body() data: SkillsDto,
  ) {
    return await this.skillsService.createSkill(orgId, authorId, data);
  }

  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Put('update-skill/:skillId/authorId/:authorId')
  async updateSkill(
    @Param('skillId') skillId: string,
    @Param('authorId') authorId: string,
    @Body() data: SkillsDto,
  ) {
    return await this.skillsService.updateSkill(skillId, authorId, data);
  }

  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Delete('delete-skill/:skillId/authorId/:authorId')
  async deleteSkill(
    @Param('skillId') skillId: string,
    @Param('authorId') authorId: string,
  ) {
    return await this.skillsService.deleteSkill(skillId, authorId);
  }

  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Put('assign-skill-to-department/:skillId/depId/:depId/managerId/:managerId')
  async assignSkillToDepartment(
    @Param('skillId') skillId: string,
    @Param('depId') depId: string,
    @Param('managerId') managerId: string,
  ) {
    return await this.skillsService.assignSkillToDepartment(
      skillId,
      depId,
      managerId,
    );
  }

  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Put(
    'delete-skill-from-department/:skillId/depId/:depId/managerId/:managerId',
  )
  async deleteSkillToDepartment(
    @Param('skillId') skillId: string,
    @Param('depId') depId: string,
    @Param('managerId') managerId: string,
  ) {
    return await this.skillsService.deleteSkillFromDepartment(
      skillId,
      depId,
      managerId,
    );
  }

  @Roles(Role.EMPLOYEE)
  @Post('assign-skill')
  async assignSkill(
    @Param('orgId') orgId: string,
    @Body() skillAssign: AssignSkillDto,
  ) {
    return await this.skillsService.assignSkill(orgId, skillAssign);
  }

  @Roles(Role.EMPLOYEE)
  @Delete('delete-skill-from-employee/:skillAssignmentId/employee/:empId')
  async removeSkillFromEmployee(
    @Param('orgId') orgId: string,
    @Param('skillAssignmentId') skillAssignmentId: string,
    @Param('empId') empId: string,
  ) {
    return this.skillsService.removeSkillFromEmployee(
      orgId,
      skillAssignmentId,
      empId,
    );
  }
}
