import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProjectDto,
  ProjectTeamRoleDto,
} from 'src/projects/dtos/create-project.dto';
import { ProjectStatus } from 'src/projects/types/project-types';

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllProjects(orgId: string) {
    const org = await this.prismaService.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) throw new NotFoundException('Organization not found');

    return await this.prismaService.project.findMany({
      where: {
        organizationId: orgId,
      },
    });
  }

  async createProject(orgId: string, project: CreateProjectDto) {
    const org = await this.prismaService.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) throw new NotFoundException('Organization not found');

    if (
      project.status !== ProjectStatus.NOT_STARTED &&
      project.status !== ProjectStatus.STARTING
    )
      throw new HttpException(
        'During creation, only the following statuses can be set: Not Started OR Starting',
        400,
      );

    const prismaProjectData = {
      organization: { connect: { id: orgId } },
      name: project.name,
      period: project.period,
      startDate: new Date(project.startDate),
      deadlineDate: project.deadlineDate
        ? new Date(project.deadlineDate)
        : null,
      status: project.status,
      description: project.description,
      technologyStack: project.technologyStack,
    };

    const createdProject = await this.prismaService.project.create({
      data: prismaProjectData,
    });

    const prismaTeamRolesData = project.teamRoles.map(
      (teamRole: ProjectTeamRoleDto) => ({
        teamroleId: teamRole.teamroleId,
        nrOfMembers: teamRole.nrOfMembers,
        projectId: createdProject.id,
      }),
    );

    await this.prismaService.projectTeamRole.createMany({
      data: prismaTeamRolesData,
    });

    return createdProject;
  }

  async getProject(id: string) {
    const project = await this.prismaService.project.findUnique({
      where: {
        id,
      },
      include: {
        teamRoles: {
          include: {
            teamRole: true,
          },
        },
        organization: true,
      },
    });

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async updateProject(id: string, project: CreateProjectDto) {
    const existingProject = await this.prismaService.project.findUnique({
      where: { id },
      include: { teamRoles: true },
    });

    if (!existingProject) {
      throw new NotFoundException('Project not found');
    }

    const prismaProjectData = {
      name: project.name,
      period: project.period,
      startDate: new Date(project.startDate),
      deadlineDate: project.deadlineDate
        ? new Date(project.deadlineDate)
        : null,
      status: project.status,
      description: project.description,
      technologyStack: project.technologyStack,
    };

    const updatedProject = await this.prismaService.project.update({
      where: { id },
      data: prismaProjectData,
      include: { teamRoles: true },
    });

    const existingTeamRoles = existingProject.teamRoles;
    const updatedTeamRoles = project.teamRoles;

    const teamRolesToDelete = existingTeamRoles.filter(
      (existingTeamRole) =>
        !updatedTeamRoles.some(
          (updatedTeamRole) =>
            updatedTeamRole.teamroleId === existingTeamRole.teamroleId,
        ),
    );
    await this.prismaService.projectTeamRole.deleteMany({
      where: {
        projectId: id,
        teamroleId: { in: teamRolesToDelete.map((role) => role.teamroleId) },
      },
    });

    const teamRolesToCreate = updatedTeamRoles
      .filter(
        (updatedTeamRole) =>
          !existingTeamRoles.some(
            (existingTeamRole) =>
              existingTeamRole.teamroleId === updatedTeamRole.teamroleId,
          ),
      )
      .map((newTeamRole) => ({
        teamroleId: newTeamRole.teamroleId,
        nrOfMembers: newTeamRole.nrOfMembers,
        projectId: id,
      }));

    if (teamRolesToCreate.length > 0) {
      await this.prismaService.projectTeamRole.createMany({
        data: teamRolesToCreate,
      });
    }

    return updatedProject;
  }

  async deleteProject(id: string) {
    const project = await this.prismaService.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) throw new NotFoundException('Project not found');

    const existingStatus =
      project.status === ProjectStatus.IN_PROGRESS ||
      project.status === ProjectStatus.CLOSING ||
      project.status === ProjectStatus.CLOSED;

    if (existingStatus)
      throw new HttpException('Project cannot be deleted', 400);

    return await this.prismaService.project.delete({
      where: {
        id,
      },
    });
  }
}
