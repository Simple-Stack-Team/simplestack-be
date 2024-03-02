import { Body, Controller, Get, Param, Put } from '@nestjs/common';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/types/role.types';
import { EmployeesService } from 'src/employees/employees.service';
import { rolesDto } from 'src/employees/dto/assign-roles.dto';

@Controller('organizations/:orgId/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles(Role.ORGANIZATION_ADMIN)
  @Get()
  async getAllEmployees(@Param('orgId') orgId: string) {
    return await this.employeesService.getAllEmployees(orgId);
  }

  @Roles(Role.EMPLOYEE) // aici accesul e corect?
  @Get(':id/employee')
  async getEmployee(@Param('orgId') orgId: string, @Param('id') id: string) {
    return await this.employeesService.getEmployeeById(orgId, id);
  }

  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Get('unassigned-employees')
  async getUnassignedMemmers(@Param('orgId') orgId: string) {
    return await this.employeesService.getUnassignedMembers(orgId);
  }

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
