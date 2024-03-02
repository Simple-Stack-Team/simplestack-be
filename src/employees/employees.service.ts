import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Employee } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getEmployees(): Promise<Employee[]> {
    try {
      return await this.prismaService.employee.findMany();
    } catch (error) {
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getEmployeeById(id: string): Promise<Employee> {
    const employee = await this.prismaService.employee.findUnique({
      where: { id },
      include: { organization: true },
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
}
