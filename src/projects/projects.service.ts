import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProjectDto,
  ProjectTeamRoleDto,
} from 'src/projects/dtos/create-project.dto';
import { ProjectStatus } from 'src/projects/types/project-types';
import { TeamFinderQueryDto } from 'src/projects/dtos/team-finder.dto';
import {
  AssignmentProposalDto,
  DeallocationProposalDto,
} from 'src/projects/dtos/assign-dealloc-proposal';

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

  async teamFinder(
    orgId: string,
    projectId: string,
    query: TeamFinderQueryDto,
  ) {
    const org = await this.prismaService.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) throw new NotFoundException('Organization not found');

    const project = await this.getProject(projectId);

    const technologyStack = project.technologyStack.map((skill) =>
      skill.toLowerCase(),
    );

    const employees = await this.prismaService.employee.findMany({
      where: {
        organizationId: orgId,
      },
      select: {
        id: true,
        name: true,
        personalSkills: {
          include: {
            skill: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
        projects: {
          include: {
            project: {
              include: {
                teamRoles: {
                  include: {
                    teamRole: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    let fittingEmployees = employees.filter((employee) => {
      let personalSkillsLowerCase = employee.personalSkills.map(
        (skillAssignment) => skillAssignment.skill.name.toLowerCase(),
      );

      if (query.includePastProjects) {
        const pastTechnlogyStack = employee.projects.flatMap(
          (pastProject) => pastProject.project.technologyStack,
        );

        const pastTeamRoles = employee.projects.flatMap((pastProject) =>
          pastProject.project.teamRoles.map(
            (teamRole) => teamRole.teamRole.name,
          ),
        );

        personalSkillsLowerCase = personalSkillsLowerCase.concat(
          pastTechnlogyStack.map((role) => role.toLowerCase()),
          pastTeamRoles.map((role) => role.toLowerCase()),
        );
      }

      const isFitSkillOrPastRole = personalSkillsLowerCase.some((skill) =>
        technologyStack.includes(skill),
      );

      return isFitSkillOrPastRole;
    });

    if (
      query.includePartiallyAvailable ||
      query.includeCloseToFinish ||
      query.includeUnavailable
    ) {
      const fullyAvailableEmployees = [];

      if (query.includePartiallyAvailable) {
        fittingEmployees = fittingEmployees.filter((employee) => {
          const totalHours = employee.projects.reduce(
            (totalHours, project) => totalHours + project.workHours,
            0,
          );
          if (totalHours < 8) return true;
          else {
            fullyAvailableEmployees.push(employee);
            return false;
          }
        });
      }

      if (query.includeCloseToFinish) {
        const maxWeeks = query.deadlineWeeks || 6;
        const deadlineThreshold = new Date();
        deadlineThreshold.setDate(deadlineThreshold.getDate() + 7 * maxWeeks);
        fittingEmployees = fittingEmployees.filter((employee) => {
          if (
            employee.projects.some(
              (employeeProject) =>
                employeeProject.project.deadlineDate &&
                employeeProject.project.deadlineDate <= deadlineThreshold,
            )
          )
            return true;
          else {
            fullyAvailableEmployees.push(employee);
            return false;
          }
        });
      }

      if (query.includeUnavailable) {
        fittingEmployees = fittingEmployees.filter((employee) => {
          const totalHours = employee.projects.reduce(
            (totalHours, project) => totalHours + project.workHours,
            0,
          );
          if (totalHours === 8) return true;
          else {
            fullyAvailableEmployees.push(employee);
            return false;
          }
        });
      }

      fittingEmployees.push(...fullyAvailableEmployees);
    }

    return fittingEmployees;
  }

  async assignmentProposal(
    orgId: string,
    projectId: string,
    empId: string,
    data: AssignmentProposalDto,
  ) {
    const employee = await this.prismaService.employee.findUnique({
      where: { id: empId },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    const project = await this.prismaService.project.findUnique({
      where: { id: projectId },
      include: { teamRoles: true },
    });
    if (!project) throw new NotFoundException('Employee not found');

    const teamRole = await this.prismaService.teamRole.findMany({
      where: { organizationId: orgId },
    });
    const roles = [];
    teamRole.filter((role) => {
      roles.push(role.name);
    });
    data.teamRoles.filter((r) => {
      if (!roles.includes(r)) {
        throw new NotFoundException('Team role not found');
      }
    });
    return await this.prismaService.assignmentProposal.create({
      data: {
        workHours: data.workHours,
        projectId: projectId,
        teamRoles: data.teamRoles,
        comments: data.comments,
        employeeId: empId,
      },
    });
  }

  async deallocationProposal(
    projectId: string,
    empId: string,
    data: DeallocationProposalDto,
  ) {
    const project = await this.prismaService.project.findUnique({
      where: { id: projectId },
      include: {
        members: true,
      },
    });
    if (!project) throw new NotFoundException('Project not found');

    const employee = await this.prismaService.employee.findUnique({
      where: { id: empId },
    });
    if (!employee) throw new NotFoundException('Employee not found');

    const membersId = project.members.map((m) => m.employeeId);

    if (!membersId.includes(empId))
      throw new HttpException('Employee is not a part of this project', 409);

    return await this.prismaService.deallocationProposal.create({
      data: {
        employeeId: empId,
        projectId: projectId,
        reason: data.reason,
      },
    });
  }
}
