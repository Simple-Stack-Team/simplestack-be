import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Employee } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { rolesDto } from 'src/employees/dto/assign-roles.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllEmployees(orgId: string): Promise<Employee[]> {
    try {
      return await this.prismaService.employee.findMany({
        where: { organizationId: orgId },
        include: {
          department: true,
          managerAt: true,
        },
      });
    } catch (error) {
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getEmployeeById(orgId: string, id: string): Promise<Employee> {
    const employee = await this.prismaService.employee.findUnique({
      where: { organizationId: orgId, id },
      include: {
        organization: true,
        personalSkills: true,
        createdSkills: true,
        department: true,
        managerAt: true,
      },
    });

    if (!employee) throw new NotFoundException();

    return employee;
  }

  async getEmployeeByEmail(email: string): Promise<Employee> {
    const employee = await this.prismaService.employee.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!employee) throw new NotFoundException();

    return employee;
  }

  async createEmployee(
    name: string,
    email: string,
    password: string,
    orgId: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);

    return await this.prismaService.employee.create({
      data: {
        email,
        name,
        password: hashedPassword,
        organizationId: orgId,
      },
    });
  }

  async getUnassignedMembers(orgId: string): Promise<Employee[]> {
    const org = await this.prismaService.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) throw new NotFoundException('Organization not found');

    const data = await this.prismaService.employee.findMany({
      where: {
        organizationId: orgId,
      },
    });
    const result = data.filter((emp) => emp.departmentId === null);
    return result;
  }

  async assignRoles(orgId: string, id: string, roles: rolesDto) {
    const ROLE = [
      'PROJECT_MANAGER',
      'DEPARTMENT_MANAGER',
      'ORGANIZATION_ADMIN',
    ];

    const employee = await this.prismaService.employee.findUnique({
      where: { id, organizationId: orgId },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    const newRoles = roles.roles.filter((role) => ROLE.includes(role));

    if (
      !newRoles.includes('ORGANIZATION_ADMIN') &&
      employee.roles.includes('ORGANIZATION_ADMIN')
    ) {
      const nr_org_admin = await this.prismaService.employee.count({
        where: {
          organizationId: orgId,
          roles: {
            has: 'ORGANIZATION_ADMIN',
          },
        },
      });
      if (nr_org_admin === 1)
        throw new HttpException(
          'Organization should have at least one organization admin',
          409,
        );
    }

    newRoles.push('EMPLOYEE');

    return await this.prismaService.employee.update({
      where: { id, organizationId: orgId },
      data: {
        roles: {
          set: newRoles,
        },
      },
    });
  }
}
