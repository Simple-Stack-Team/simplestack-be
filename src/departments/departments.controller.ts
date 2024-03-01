import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/types/role.types';

import { DepartmentsService } from 'src/departments/departments.service';
import { CreateDepartmentDto } from 'src/departments/dto/create-department.dto';

@Controller('organizations/:orgId/departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

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

  @Roles(Role.ORGANIZATION_ADMIN)
  @Get()
  async findAll(@Param('orgId') orgId: string) {
    return await this.departmentsService.getOrganizationDepartments(orgId);
  }

  @Roles(Role.ORGANIZATION_ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.departmentsService.getDepartment(id);
  }

  @Roles(Role.ORGANIZATION_ADMIN)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: CreateDepartmentDto,
  ) {
    return await this.departmentsService.updateDepartmentName(
      id,
      updateDepartmentDto.name,
    );
  }

  @Roles(Role.ORGANIZATION_ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.departmentsService.deleteDepartment(id);
  }

  @Roles(Role.ORGANIZATION_ADMIN)
  @Put('assign-manager-role/:id')
  async assignDepManagerRole(@Param('id') id: string) {
    return await this.departmentsService.assignDepManagerRole(id);
  }

  @Roles(Role.ORGANIZATION_ADMIN)
  @Put(':depId/assign-manager/:depManagerId')
  async assignDepartManager(
    @Param('depId') depId: string,
    @Param('depManagerId') depManagerId: string,
  ) {
    return await this.departmentsService.assignDepManager(depId, depManagerId);
  }
}
