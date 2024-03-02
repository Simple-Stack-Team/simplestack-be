import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(orgId: string, name: string) {
    const org = this.prismaService.organization.findUnique({
      where: {
        id: orgId,
      },
    });

    if (!org) throw new NotFoundException('Organization not found');

    const department = await this.prismaService.department.findFirst({
      where: {
        organizationId: orgId,
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    if (department)
      throw new HttpException('Department with that name already exist', 409);

    return await this.prismaService.department.create({
      data: {
        name: name,
        organizationId: orgId,
      },
    });
  }

  async getOrganizationDepartments(orgId: string) {
    return await this.prismaService.department.findMany({
      where: {
        organizationId: orgId,
      },
    });
  }

  async getDepartment(id: string) {
    const department = await this.prismaService.department.findUnique({
      where: {
        id,
      },
    });

    if (!department) throw new NotFoundException('Department not found');
    return department;
  }

  async updateDepartmentName(id: string, name: string) {
    const department = await this.prismaService.department.update({
      where: { id },
      data: {
        name,
      },
    });

    if (!department) throw new NotFoundException('Department not found');
    return department;
  }

  async deleteDepartment(id: string) {
    const department = await this.prismaService.department.findUnique({
      where: { id },
      include: { members: true }, // Include associated employees
    });

    if (!department) throw new NotFoundException('Department not found');

    if (department.members.length > 0) {
      await this.prismaService.employee.updateMany({
        where: { departmentId: id },
        data: { departmentId: null },
      });
    }
    return this.prismaService.department.delete({
      where: { id },
    });
  }

  async assignDepManagerRole(id: string) {
    const employee = await this.prismaService.employee.findUnique({
      where: { id },
      include: { organization: true, department: false },
    });

    if (!employee) throw new NotFoundException('Employee not found');
    if (employee.roles.includes('DEPARTMENT_MANAGER'))
      throw new HttpException(
        'Employee already have role of department manager',
        409,
      );
    return await this.prismaService.employee.update({
      where: { id },
      data: {
        roles: {
          push: 'DEPARTMENT_MANAGER',
        },
      },
    });
  }

  async assignDepManager(depId: string, depManagerId: string) {
    const dep = await this.getDepartment(depId);
    if (dep.managerId)
      throw new HttpException('Department already has a manager assigned', 409);
    const employee = await this.prismaService.employee.findUnique({
      where: { id: depManagerId },
      include: { organization: true, department: false },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    if (!employee.roles.includes('DEPARTMENT_MANAGER'))
      throw new HttpException(
        'Employee do not have role of department manager',
        409,
      );

    const alreadyManager = await this.prismaService.department.findUnique({
      where: { managerId: depManagerId },
    });
    if (alreadyManager) {
      throw new HttpException(
        'Employee is already a manager of another department',
        409,
      );
    }

    await this.prismaService.employee.update({
      where: { id: depManagerId },
      data: {
        departmentId: depId,
        managerAt: {
          connect: { id: depId },
        },
      },
    });

    return await this.prismaService.department.update({
      where: { id: depId },
      data: {
        managerId: depManagerId,
      },
    });
  }

  async assignDepMember(depId: string, empId: string) {
    await this.getDepartment(depId);
    const employee = await this.prismaService.employee.findUnique({
      where: { id: empId },
      include: { organization: true },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    if (employee.departmentId)
      throw new HttpException('Employee is already in a department', 409);

    return await this.prismaService.employee.update({
      where: { id: empId },
      data: { departmentId: depId },
    });
  }

  async deleteDepMember(depId: string, empId: string) {
    await this.getDepartment(depId);
    const emp = this.prismaService.employee.findUnique({
      where: { id: empId, departmentId: depId },
    });
    if (!emp) throw new NotFoundException('Employee not found');

    return await this.prismaService.employee.update({
      where: { id: empId },
      data: {
        departmentId: null,
      },
    });
  }
}
