import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { EmployeesService } from 'src/employees/employees.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      global: true,
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    EmployeesService,
    PrismaService,
    OrganizationsService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
