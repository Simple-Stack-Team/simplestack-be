import { HttpException, Injectable } from '@nestjs/common';
import { Organization } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrganization(
    name: string,
    address: string,
  ): Promise<Organization> {
    try {
      return await this.prismaService.organization.create({
        data: {
          orgName: name,
          headquarterAdress: address,
        },
      });
    } catch (error) {
      throw new HttpException('Server error', 505);
    }
  }
}
