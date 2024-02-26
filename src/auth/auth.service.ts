import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { EmployeesService } from 'src/employees/employees.service';
import { SignUpAdminDto } from 'src/auth/dto/auth-signup-org.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class AuthService {
  constructor(
    private employeeService: EmployeesService,
    private organizationService: OrganizationsService,
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async logIn(email: string, pass: string) {
    const user = await this.employeeService.getEmployeeByEmail(email);

    if (!(await this.comparePasswords(pass, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
      orgId: user.organizationId,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: payload,
    };
  }

  async signUpAdmin(signUpAdminDto: SignUpAdminDto): Promise<any> {
    const { name, email, password, headquarterAddress, organizationName } =
      signUpAdminDto;

    const user = await this.prismaService.employee.findUnique({
      where: { email },
    });

    if (user) throw new HttpException('User already exist', 409);

    const organization = await this.organizationService.createOrganization(
      organizationName,
      headquarterAddress,
    );

    const admin = await this.employeeService.createEmployee(
      name,
      email,
      password,
      organization.id,
    );

    return await this.prismaService.employee.update({
      where: { id: admin.id },
      data: {
        roles: {
          push: 'ORGANIZATION_ADMIN',
        },
      },
    });
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePasswords(loginPassword: string, userPassword: string) {
    return await bcrypt.compare(loginPassword, userPassword);
  }
}
