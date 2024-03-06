import { Body, Controller, Get, HttpStatus, Param, Put } from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/types/role.types';
import { EmployeesService } from 'src/employees/employees.service';
import { rolesDto } from 'src/employees/dto/assign-roles.dto';

@ApiBearerAuth()
@ApiTags('employees')
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
@ApiNotFoundResponse({ description: 'Organization not found' })
@Controller('organizations/:orgId/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiResponse({ status: HttpStatus.OK })
  @Roles(Role.ORGANIZATION_ADMIN)
  @Get()
  async getAllEmployees(@Param('orgId') orgId: string) {
    return await this.employeesService.getAllEmployees(orgId);
  }

  @ApiNotFoundResponse({ description: 'Employee not found' })
  @ApiResponse({ status: HttpStatus.OK })
  @Roles(Role.EMPLOYEE)
  @Get(':id/employee')
  async getEmployee(@Param('orgId') orgId: string, @Param('id') id: string) {
    return await this.employeesService.getEmployeeById(orgId, id);
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Get('unassigned-employees')
  async getUnassignedMemmers(@Param('orgId') orgId: string) {
    return await this.employeesService.getUnassignedMembers(orgId);
  }

  @ApiNotFoundResponse({ description: 'Employee not found' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Roles(Role.ORGANIZATION_ADMIN)
  @Put('assign-roles/:id')
  async assignRoles(
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @Body() roles: rolesDto,
  ) {
    return await this.employeesService.assignRoles(orgId, id, roles);
  }
}
