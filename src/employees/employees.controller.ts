import { Controller, Get, Param } from '@nestjs/common';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/types/role.types';
import { EmployeesService } from 'src/employees/employees.service';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles(Role.EMPLOYEE)
  @Get(':id')
  async getEmployee(@Param('id') id: string) {
    return await this.employeesService.getEmployeeById(id);
  }

  @Roles(Role.DEPARTMENT_MANAGER, Role.ORGANIZATION_ADMIN)
  @Get(':orgId/unassigned-employees')
  async getUnassignMemmers(@Param('orgId') orgId: string) {
    return await this.employeesService.getUnassignMembers(orgId);
  }
}
