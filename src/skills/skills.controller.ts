import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { SkillsDto } from 'src/skills/dto/create-updates-skills.dto';
import { SkillCategoryDto } from 'src/skills/dto/skill-category.dto';
import { Role } from 'src/auth/types/role.types';
import { SkillsService } from 'src/skills/skills.service';
import { AssignSkillDto } from 'src/skills/dto/assign-skill.dto';

@ApiBearerAuth()
@ApiTags('skills')
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
@Controller('organizations/:organization-id/skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiCreatedResponse({ description: 'Skill category created' })
  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Post('skill-category')
  async createSkillCategory(
    @Param('organization-id') orgId: string,
    @Body() data: SkillCategoryDto,
  ) {
    return await this.skillsService.createSkillCategory(orgId, data.name);
  }

  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiOkResponse({ description: 'Organization skill categories list' })
  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Get('skill-categories')
  async getSkillsCategories(@Param('organization-id') orgId: string) {
    return await this.skillsService.getSkillsCategories(orgId);
  }

  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiOkResponse({ description: 'Organization skills list' })
  @Roles(Role.EMPLOYEE)
  @Get()
  async getSkills(@Param('organization-id') orgId: string) {
    return await this.skillsService.getSkills(orgId);
  }

  @ApiNotFoundResponse({ description: 'Skill category not found' })
  @ApiCreatedResponse({ description: 'Skill category updated' })
  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Put('skill-category/update/:category-skill-id')
  async updateSkillCategory(
    @Param('category-skill-id') id: string,
    @Body() data: SkillCategoryDto,
  ) {
    return await this.skillsService.updateSkillCategory(id, data.name);
  }

  @ApiNotFoundResponse({ description: 'Skill Category not found' })
  @ApiOkResponse({ description: 'Skill category deleted' })
  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Delete('skill-category/delete/:category-skill-id')
  async deleteSkillCategory(@Param('category-skill-id') id: string) {
    return await this.skillsService.deleteSkillCategory(id);
  }

  @ApiNotFoundResponse({ description: 'Skill category or employee not found' })
  @ApiCreatedResponse({ description: 'Skill created' })
  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Post('create-skill/:author-id')
  async createSkill(
    @Param('organization-id') orgId: string,
    @Param('author-id') authorId: string,
    @Body() data: SkillsDto,
  ) {
    return await this.skillsService.createSkill(orgId, authorId, data);
  }

  @ApiNotFoundResponse({ description: 'Skill not found' })
  @ApiForbiddenResponse({
    description: 'You have no rights to update this skill',
  })
  @ApiCreatedResponse({ description: 'Skill updated' })
  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Put('update-skill/:skill-id/author-id/:author-id')
  async updateSkill(
    @Param('skill-id') skillId: string,
    @Param('author-id') authorId: string,
    @Body() data: SkillsDto,
  ) {
    return await this.skillsService.updateSkill(skillId, authorId, data);
  }

  @ApiNotFoundResponse({ description: 'Skill not found' })
  @ApiOkResponse({ description: 'Skill deleted' })
  @ApiForbiddenResponse({
    description: 'You have no rights to delete this skill',
  })
  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Delete('delete-skill/:skill-id/author-id/:author-id')
  async deleteSkill(
    @Param('skill-id') skillId: string,
    @Param('author-id') authorId: string,
  ) {
    return await this.skillsService.deleteSkill(skillId, authorId);
  }

  @ApiNotFoundResponse({ description: 'Department or skill not found' })
  @ApiForbiddenResponse({
    description: 'You have no rights for this action',
  })
  @ApiConflictResponse({
    description: 'Department already contains this skill',
  })
  @ApiCreatedResponse({ description: 'Skill assigned' })
  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Put(
    'assign-skill-to-department/:skill-id/dep-id/:dep-id/manager-id/:manager-id',
  )
  async assignSkillToDepartment(
    @Param('skill-id') skillId: string,
    @Param('dep-id') depId: string,
    @Param('manager-id') managerId: string,
  ) {
    return await this.skillsService.assignSkillToDepartment(
      skillId,
      depId,
      managerId,
    );
  }

  @ApiNotFoundResponse({ description: 'Skill or department not found' })
  @ApiForbiddenResponse({
    description: 'You have no rights for this action',
  })
  @ApiConflictResponse({
    description: 'Department do not contains this skill',
  })
  @ApiOkResponse({ description: 'Skill assigned' })
  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Put(
    'delete-skill-from-department/:skill-id/dep-id/:dep-id/manager-id/:manager-id',
  )
  async deleteSkillToDepartment(
    @Param('skill-id') skillId: string,
    @Param('dep-id') depId: string,
    @Param('manager-id') managerId: string,
  ) {
    return await this.skillsService.deleteSkillFromDepartment(
      skillId,
      depId,
      managerId,
    );
  }

  @ApiNotFoundResponse({ description: 'Employee or skill not found' })
  @ApiCreatedResponse({ description: 'Skill assigned' })
  @Roles(Role.EMPLOYEE)
  @Post('assign-skill')
  async assignSkill(
    @Param('organization-id') orgId: string,
    @Body() skillAssign: AssignSkillDto,
  ) {
    return await this.skillsService.assignSkill(orgId, skillAssign);
  }

  @ApiNotFoundResponse({
    description: 'Assignmented skill or employee not found',
  })
  @ApiOkResponse({ description: 'Skill removed' })
  @Roles(Role.EMPLOYEE)
  @Delete(
    'delete-skill-from-employee/:skill-assignment-id/employee/:employee-id',
  )
  async removeSkillFromEmployee(
    @Param('organization-id') orgId: string,
    @Param('skill-assignment-id') skillAssignmentId: string,
    @Param('employee-id') empId: string,
  ) {
    return this.skillsService.removeSkillFromEmployee(
      orgId,
      skillAssignmentId,
      empId,
    );
  }
}
