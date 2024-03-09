import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/types/role.types';
import { ProjectsService } from 'src/projects/projects.service';
import { CreateProjectDto } from 'src/projects/dtos/create-project.dto';
import { AssignmentProposalDto } from 'src/projects/dtos/assignment-proposal.dto';

@ApiBearerAuth()
@ApiTags('projects')
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
@ApiNotFoundResponse({ description: 'Organization/Project not found' })
@ApiInternalServerErrorResponse()
@Controller('organizations/:orgId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOkResponse({ description: 'Organization projects list' })
  @Get()
  async getAll(@Param('orgId') orgId: string) {
    return await this.projectsService.getAllProjects(orgId);
  }

  @Roles(Role.PROJECT_MANAGER)
  @ApiCreatedResponse({ description: 'Project created' })
  @ApiBadRequestResponse({
    description:
      'During creation, only the following statuses can be set: Not Started OR Starting',
  })
  @Post()
  async create(
    @Param('orgId') orgId: string,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return await this.projectsService.createProject(orgId, createProjectDto);
  }

  @ApiOkResponse({ description: 'Project view' })
  @Get(':id')
  async getProject(@Param('id') id: string) {
    return await this.projectsService.getProject(id);
  }

  @ApiOkResponse({ description: 'Project updated' })
  @Roles(Role.PROJECT_MANAGER)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: CreateProjectDto,
  ) {
    return await this.projectsService.updateProject(id, updateProjectDto);
  }

  @ApiOkResponse({ description: 'Project deleted' })
  @Roles(Role.PROJECT_MANAGER)
  @Delete(':id')
  async deleteProject(@Param('id') id: string) {
    return await this.projectsService.deleteProject(id);
  }

  @ApiOkResponse({ description: 'Assignment proposal sent' })
  @Roles(Role.PROJECT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Post(':projectId/employee/:employeeId')
  async AssignmentProposal(
    @Param('projectId') projectId: string,
    @Param('employeeId') empId: string,
    @Body() data: AssignmentProposalDto,
  ) {
    return this.projectsService.AssignmentProposal(projectId, empId, data);
  }
}
