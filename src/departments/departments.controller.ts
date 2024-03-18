import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/types/role.types';

import { DepartmentsService } from 'src/departments/departments.service';
import { CreateDepartmentDto } from 'src/departments/dto/create-department.dto';

@ApiTags('departments')
@ApiBearerAuth()
@Controller('organizations/:orgId/departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @ApiCreatedResponse({ description: 'Department created' })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @Roles(Role.ORGANIZATION_ADMIN)
  @Post()
  async create(
    @Param('orgId') orgId: string,
    @Body() createDepartmentDto: CreateDepartmentDto,
  ) {
    return await this.departmentsService.create(
      orgId,
      createDepartmentDto.name,
    );
  }

  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiOkResponse({ description: 'Organization departments list' })
  @Roles(Role.ORGANIZATION_ADMIN)
  @Get()
  async findAll(@Param('orgId') orgId: string) {
    return await this.departmentsService.getOrganizationDepartments(orgId);
  }

  @ApiNotFoundResponse({ description: 'Department not found' })
  @Roles(Role.ORGANIZATION_ADMIN)
  @Get(':depId')
  async findOne(@Param('depId') id: string) {
    return await this.departmentsService.getDepartment(id);
  }

  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiNotFoundResponse({ description: 'Department not found' })
  @Roles(Role.ORGANIZATION_ADMIN)
  @Put(':depId')
  async update(
    @Param('depId') id: string,
    @Param('orgId') orgId: string,
    @Body() updateDepartmentDto: CreateDepartmentDto,
  ) {
    return await this.departmentsService.updateDepartmentName(
      id,
      orgId,
      updateDepartmentDto.name,
    );
  }

  @ApiNotFoundResponse({ description: 'Department not found' })
  @Roles(Role.ORGANIZATION_ADMIN)
  @Delete(':depId')
  async remove(@Param('depId') id: string) {
    return await this.departmentsService.deleteDepartment(id);
  }

  @ApiConflictResponse({
    description: 'Already a manager at another department',
  })
  @Roles(Role.ORGANIZATION_ADMIN)
  @Put(':depId/assign-manager/:depManagerId')
  async assignDepartManager(
    @Param('depId') depId: string,
    @Param('depManagerId') depManagerId: string,
  ) {
    return await this.departmentsService.assignDepManager(depId, depManagerId);
  }

  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @ApiNotFoundResponse({ description: 'Department/Employee not found' })
  @Put(':depId/assign-member/:empId')
  async assignDepartMember(
    @Param('depId') depId: string,
    @Param('empId') empId: string,
  ) {
    return await this.departmentsService.assignDepMember(depId, empId);
  }

  @ApiNotFoundResponse({ description: 'Department/Employee not found' })
  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Delete(':depId/delete-member/:empId')
  async deleteDepartMembers(
    @Param('depId') depId: string,
    @Param('empId') empId: string,
  ) {
    return await this.departmentsService.deleteDepMember(depId, empId);
  }

  @ApiNotFoundResponse({ description: 'Department not found' })
  @Roles(Role.DEPARTMENT_MANAGER)
  @Get(':depId/members')
  async getDepartmentMembers(@Param('depId') id: string) {
    return await this.departmentsService.getDepartmentMembers(id);
  }

  @ApiNotFoundResponse({ description: 'Department not found' })
  @Roles(Role.DEPARTMENT_MANAGER)
  @Get(':depId/notifications')
  async getDepartmentNotifications(@Param('depId') id: string) {
    return await this.departmentsService.getDepartmentNotifications(id);
  }

  @ApiNotFoundResponse({ description: 'Notification not found' })
  @Roles(Role.DEPARTMENT_MANAGER)
  @Put('notification/:notificationId')
  async readNotification(@Param('notificationId') id: string) {
    return await this.departmentsService.readNotification(id);
  }
}
