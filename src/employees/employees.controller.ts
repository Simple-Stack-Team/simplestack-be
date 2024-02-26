import { Controller, Get, Param } from '@nestjs/common';

import { EmployeesService } from 'src/employees/employees.service';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get(':id')
  async getEmployee(@Param('id') id: string) {
    return await this.employeesService.getEmployeeById(id);
  }
}
