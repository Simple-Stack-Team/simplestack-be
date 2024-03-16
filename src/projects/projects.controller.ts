import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  HttpStatus,
  Query,
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
import {
  GPTTeamFinderDTO,
  TeamFinderQueryDto,
} from 'src/projects/dtos/team-finder.dto';
import {
  AssignmentProposalDto,
  DeallocationProposalDto,
  ConfirmDto,
} from 'src/projects/dtos/assign-dealloc-proposal';

@ApiBearerAuth()
@ApiTags('projects')
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
@ApiNotFoundResponse({ description: 'Organization/Project not found' })
@ApiInternalServerErrorResponse()
@Controller('organizations/:orgId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Roles(Role.PROJECT_MANAGER)
  @ApiOkResponse({ description: 'Project manager projects' })
  @Get('manager')
  async getManagerProjects() {
    return await this.projectsService.getAllManagerProjects();
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

  @ApiOkResponse({ description: 'Project detailed view' })
  @Get(':projectId')
  async getProject(@Param('projectId') id: string) {
    return await this.projectsService.getProject(id);
  }

  @ApiOkResponse({ description: 'Project updated' })
  @Roles(Role.PROJECT_MANAGER)
  @Put(':projectId')
  async update(
    @Param('projectId') id: string,
    @Body() updateProjectDto: CreateProjectDto,
  ) {
    return await this.projectsService.updateProject(id, updateProjectDto);
  }

  @ApiOkResponse({ description: 'Project deleted' })
  @Roles(Role.PROJECT_MANAGER)
  @Delete(':projectId')
  async deleteProject(@Param('id') id: string) {
    return await this.projectsService.deleteProject(id);
  }

  @ApiOkResponse({ description: 'Assignment proposal sent' })
  @Roles(Role.PROJECT_MANAGER)
  @Post(':projectId/employee/:empId/assignment')
  async assignmentProposal(
    @Param('projectId') projectId: string,
    @Param('empId') empId: string,
    @Param('orgId') orgId: string,
    @Body() data: AssignmentProposalDto,
  ) {
    return await this.projectsService.assignmentProposal(
      orgId,
      projectId,
      empId,
      data,
    );
  }

  @Roles(Role.PROJECT_MANAGER)
  @ApiOkResponse({ description: 'Project team finder list' })
  @Get(':projectId/teamfinder')
  async teamFinder(
    @Param('orgId') orgId: string,
    @Param('projectId') projectId: string,
    @Query() query: TeamFinderQueryDto,
  ) {
    return await this.projectsService.teamFinder(orgId, projectId, query);
  }

  @Roles(Role.PROJECT_MANAGER)
  @ApiOkResponse({ description: 'Project team finder list' })
  @Post(':projectId/teamfinder/gpt')
  async gptTeamFinder(
    @Param('orgId') orgId: string,
    @Param('projectId') projectId: string,
    @Body() request: GPTTeamFinderDTO,
  ) {
    return await this.projectsService.gptTeamFinder(orgId, projectId, request);
  }

  @ApiOkResponse({ description: 'Deallocation proposal sent' })
  @Roles(Role.PROJECT_MANAGER)
  @Post(':projectId/employee/:empId/deallocation')
  async deallocationProposal(
    @Param('projectId') projectId: string,
    @Param('empId') empId: string,
    @Body() data: DeallocationProposalDto,
  ) {
    return await this.projectsService.deallocationProposal(
      projectId,
      empId,
      data,
    );
  }

  @ApiOkResponse({ description: 'Assignment and deallocation proposals list' })
  @Roles(Role.DEPARTMENT_MANAGER)
  @Get('/department/:depId/proposals')
  async getDepartmentProposal(@Param('depId') depId: string) {
    return await this.projectsService.getDepartmentProposal(depId);
  }

  @ApiOkResponse({ description: 'Response was sent' })
  @Roles(Role.PROJECT_MANAGER)
  @Put('/assign-employee/:assignmentId')
  async assignmentConfirmation(
    @Param('orgId') orgId: string,
    @Param('assignmentId') assignmentId: string,
    @Body() confirm: ConfirmDto,
  ) {
    return await this.projectsService.assignmentConfirmation(
      orgId,
      assignmentId,
      confirm,
    );
  }

  @ApiOkResponse({ description: 'Response was sent' })
  @Roles(Role.PROJECT_MANAGER)
  @Put('/deallocate-employee/:deallocationId/employee-project/:empProjectId')
  async deallocationConfirmation(
    @Param('orgId') orgId: string,
    @Param('deallocationId') deallocateId: string,
    @Param('empProjectId') empProjectId: string,
    @Body() confirm: ConfirmDto,
  ) {
    return await this.projectsService.deallocationConfirmation(
      orgId,
      deallocateId,
      empProjectId,
      confirm,
    );
  }

  @ApiOkResponse({ description: 'Project team view' })
  @Get(':projectId/team')
  async getProjectTeam(@Param('projectId') id: string) {
    return await this.projectsService.getProjectTeam(id);
  }

  @ApiOkResponse({
    description: 'Employee / Project manager active and past projects',
  })
  @Get('employee/:empId')
  async getEmployeeProjects(@Param('empId') id: string) {
    return await this.projectsService.getEmployeeProjects(id);
  }

  @ApiOkResponse({
    description: 'Department members projects',
  })
  @Roles(Role.DEPARTMENT_MANAGER)
  @Get('department/:depId')
  async getDepartmentProjects(@Param('depId') id: string) {
    return await this.projectsService.getDepartmentProjects(id);
  }

  @ApiOkResponse({ description: 'Deallocation proposal updated' })
  @Roles(Role.PROJECT_MANAGER)
  @Put('/deallocation-proposal/:deallocationId')
  async deallocationProposalUpdate(
    @Param('deallocationId') deallocationId: string,
    @Body() data: DeallocationProposalDto,
  ) {
    return await this.projectsService.deallocationProposalUpdate(
      deallocationId,
      data.reason,
    );
  }

  @ApiOkResponse({ description: 'Assignment proposal updated' })
  @Roles(Role.PROJECT_MANAGER)
  @Put('/assignment-proposal/:assignmentId')
  async assignmentProposalUpdate(
    @Param('assignmentId') assignmentId: string,
    @Body() data: AssignmentProposalDto,
  ) {
    return await this.projectsService.assignmentProposalUpdate(
      assignmentId,
      data,
    );
  }

  @ApiOkResponse({ description: 'Deallocation proposal deleted' })
  @Roles(Role.PROJECT_MANAGER)
  @Delete('/deallocation-proposal/:deallocationId')
  async deallocationProposalDelete(
    @Param('deallocationId') deallocationId: string,
  ) {
    return await this.projectsService.deallocationProposalDelete(
      deallocationId,
    );
  }

  @ApiOkResponse({ description: 'Deallocation proposal deleted' })
  @Roles(Role.PROJECT_MANAGER)
  @Delete('/assignment-proposal/:assignmentId')
  async assignmentProposalDelete(@Param('assignmentId') assignmentId: string) {
    return await this.projectsService.assignmentProposalDelete(assignmentId);
  }

  @ApiOkResponse({ description: 'Assignment proposals list' })
  @Roles(Role.PROJECT_MANAGER)
  @Get(':projectId/assignments-proposals')
  async getProjectAssignProposal(@Param('projectId') projectId: string) {
    return await this.projectsService.getProjectAssingProposal(projectId);
  }

  @ApiOkResponse({ description: 'Deallocation proposals list' })
  @Roles(Role.PROJECT_MANAGER)
  @Get(':projectId/deallocations-proposals')
  async getProjectDeallocProposal(@Param('projectId') projectId: string) {
    return await this.projectsService.getProjectDeallocProposal(projectId);
  }
}
