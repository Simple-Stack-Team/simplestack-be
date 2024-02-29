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
    const department = await this.prismaService.department.delete({
      where: { id },
    });

    if (!department) throw new NotFoundException('Department not found');
    return department;
  }
}
