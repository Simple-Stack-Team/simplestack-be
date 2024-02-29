import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Organization, TeamRole } from '@prisma/client';

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
      throw new HttpException('Server error', 500);
    }
  }

  async createOrganizationTeamRoles(
    name: string,
    orgId: string,
  ): Promise<TeamRole> {
    const org = await this.prismaService.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) throw new NotFoundException('Organization not found');

    return await this.prismaService.teamRole.create({
      data: {
        name,
        organizationId: orgId,
      },
    });
  }

  async getOrganizationTeamRoles(
    orgId: string,
  ): Promise<{ teamRoles: TeamRole[] }> {
    const orgTeamRoles = await this.prismaService.organization.findFirst({
      where: {
        id: orgId,
      },
      select: { teamRoles: true },
    });

    if (!orgTeamRoles) throw new NotFoundException('Organization not found');
    return orgTeamRoles;
  }

  async updateTeamRole(
    orgId: string,
    teamRoleId: string,
    updatedName: string,
  ): Promise<TeamRole> {
    const teamRole = await this.prismaService.teamRole.update({
      where: {
        id: teamRoleId,
        organizationId: orgId,
      },
      data: {
        name: updatedName,
      },
    });

    if (!teamRole) throw new NotFoundException('Team role not found');
    return teamRole;
  }

  async deleteTeamRole(orgId: string, teamRoleId: string): Promise<TeamRole> {
    const teamRole = await this.prismaService.teamRole.delete({
      where: {
        id: teamRoleId,
        organizationId: orgId,
      },
    });

    if (!teamRole) throw new NotFoundException('Team role not found');
    return teamRole;
  }
}
