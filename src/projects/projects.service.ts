import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProjectDto,
  ProjectTeamRoleDto,
} from 'src/projects/dtos/create-project.dto';
import { ProjectStatus } from 'src/projects/types/project-types';
import {
  GPTTeamFinderDTO,
  TeamFinderQueryDto,
} from 'src/projects/dtos/team-finder.dto';
import {
  AssignmentProposalDto,
  DeallocationProposalDto,
  ConfirmDto,
} from 'src/projects/dtos/assign-dealloc-proposal';
import { OpenaiService } from 'src/openai/openai.service';
import { IChatRequest } from 'src/openai/types/openai-types';
import OpenAI from 'openai';

@Injectable({ scope: Scope.REQUEST })
export class ProjectsService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly prismaService: PrismaService,
    private readonly openAIService: OpenaiService,
  ) {}

  async getAllManagerProjects() {
    return await this.prismaService.project.findMany({
      where: {
        authorId: this.request.user.sub,
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
      author: { connect: { id: this.request.user.sub } },
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
        members: {
          include: {
            employee: true,
          },
        },
        assignmentProposal: {
          include: {
            employee: true,
          },
        },
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
        department: true,
        assignmentProposal: true,
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

      if (employee.projects.some((project) => project.project.id === projectId))
        return false;

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
            (totalHours, project) =>
              !project.endWork && totalHours + project.workHours,
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

  async gptTeamFinder(
    orgId: string,
    projectId: string,
    request: GPTTeamFinderDTO,
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
          select: {
            skill: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
        department: {
          select: {
            name: true,
          },
        },
        projects: {
          select: {
            project: {
              select: {
                teamRoles: {
                  select: {
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

    const projects = await this.prismaService.employeeProject.findMany({
      select: {
        id: true,
        employee: { select: { id: true, name: true } },
        employeeRoles: true,
        project: {
          select: {
            id: true,
            technologyStack: true,
            teamRoles: true,
          },
        },
      },
    });

    const reqMessage = {
      messages: [
        {
          role: 'system',
          content: 'You are a helpful pm assistant designed to output JSON',
        },
        {
          role: 'user',
          content: `My project has the following technology stack: ${technologyStack}. Who are the employees that fit best for my technology stack? Select their id and names. ${request.prompt ? request.prompt : ''}`,
        },
        {
          role: 'assistant',
          content:
            'First, give me the list of your employees along with their skills and a list of employee projects (containing the projects that employee has/had). Then i will select those that fit based on your request. I will select their id name and personalSkills',
        },
        {
          role: 'user',
          content: `Employee are: ${employees.map((employee) =>
            JSON.stringify({
              id: employee.id,
              name: employee.name,
              skills: employee.personalSkills.map((skill) => skill.skill.name),
              departmentName: employee.department?.name ?? '',
            }),
          )}`,
        },
        {
          role: 'user',
          content: `Employee Projects are: ${JSON.stringify(projects)}`,
        },
      ],
    } as unknown as IChatRequest;

    if (request.prompt)
      reqMessage.messages.push({
        role: 'assistant',
        content: `${request.prompt}`,
      });

    const getMessages = (await this.openAIService.getMessageData(
      reqMessage,
    )) as OpenAI.ChatCompletion;
    return this.openAIService.getChatOpenaiResponse(getMessages).result.message
      .content;
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

    if (!employee.departmentId)
      throw new HttpException('Employee should be in a department', 409);

    const project = await this.prismaService.project.findUnique({
      where: { id: projectId },
      include: { teamRoles: true, members: true },
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

    const existingProposal =
      await this.prismaService.assignmentProposal.findFirst({
        where: { employeeId: empId, projectId },
      });

    if (existingProposal)
      throw new HttpException('Employee is already proposed', 409);

    await this.prismaService.notification.create({
      data: {
        departmentId: employee.departmentId,
        organizationId: employee.organizationId,
        employeeId: employee.id,
        description: `${employee.name} was proposed to be assigned in a project`,
      },
    });

    return await this.prismaService.assignmentProposal.create({
      data: {
        workHours: data.workHours,
        teamRoles: data.teamRoles,
        comments: data.comments,
        employee: { connect: { id: empId } },
        department: { connect: { id: employee.departmentId } },
        project: { connect: { id: projectId } },
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

    const employeeProject = await this.prismaService.employeeProject.findFirst({
      where: {
        projectId: projectId,
        employeeId: empId,
      },
    });

    if (!employeeProject.endWork)
      throw new HttpException('Employee is already deallocated', 409);

    await this.prismaService.notification.create({
      data: {
        departmentId: employee.departmentId,
        organizationId: employee.organizationId,
        employeeId: employee.id,
        description: `${employee.name} was proposed to be deallocated from a project`,
      },
    });

    return await this.prismaService.deallocationProposal.create({
      data: {
        employeeId: empId,
        projectId: projectId,
        reason: data.reason,
        departmentId: employee.departmentId,
        employeeProjectId: employeeProject.id,
      },
    });
  }

  async getDepartmentProposal(depId: string) {
    const department = await this.prismaService.department.findMany({
      where: { id: depId },
      include: {
        assignmentProposal: {
          include: {
            project: true,
            employee: true,
          },
        },
        deallocationProposal: {
          include: {
            project: true,
            employee: true,
          },
        },
      },
    });
    if (!department) throw new NotFoundException('Department not found');

    const assignments = department.map((data) => data.assignmentProposal);
    const deallocations = department.map((data) => data.deallocationProposal);

    return { assignments, deallocations };
  }

  async assignmentConfirmation(
    orgId: string,
    assignmentId: string,
    confirm: ConfirmDto,
  ) {
    const org = await this.prismaService.organization.findUnique({
      where: {
        id: orgId,
      },
    });

    if (!org) throw new NotFoundException('Organization not found');

    const assignment = await this.prismaService.assignmentProposal.findUnique({
      where: {
        id: assignmentId,
      },
      include: {
        project: true,
        employee: true,
      },
    });

    if (!assignment) throw new NotFoundException('Assignment not found');

    if (!confirm.confirm) {
      return await this.prismaService.assignmentProposal.delete({
        where: { id: assignmentId },
      });
    }

    const employeeProject = await this.prismaService.employeeProject.create({
      data: {
        organizationId: orgId,
        projectId: assignment.projectId,
        employeeId: assignment.employeeId,
        startWork: new Date().toISOString(),
        endWork: null,
        workHours: assignment.workHours,
        employeeRoles: [...assignment.teamRoles],
      },
    });

    await this.prismaService.assignmentProposal.delete({
      where: { id: assignmentId },
    });

    return employeeProject;
  }

  async deallocationConfirmation(
    orgId: string,
    deallocateId: string,
    empProjectId: string,
    confirm: ConfirmDto,
  ) {
    const org = await this.prismaService.organization.findUnique({
      where: {
        id: orgId,
      },
    });

    if (!org) throw new NotFoundException('Organization not found');

    const deallocation =
      await this.prismaService.deallocationProposal.findUnique({
        where: {
          id: deallocateId,
        },
        include: {
          project: true,
          employee: true,
        },
      });

    if (!deallocation) throw new NotFoundException('Assignment not found');

    if (!confirm.confirm) {
      return await this.prismaService.deallocationProposal.delete({
        where: { id: deallocateId },
      });
    }

    const employeeProject = await this.prismaService.employeeProject.update({
      where: { id: empProjectId },
      data: {
        endWork: new Date().toISOString(),
      },
    });

    await this.prismaService.deallocationProposal.delete({
      where: { id: deallocateId },
    });

    return employeeProject;
  }

  async getProjectTeam(projectId: string) {
    const project = await this.getProject(projectId);

    const proposedMembers = project.assignmentProposal;

    const members = await this.prismaService.employeeProject.findMany({
      where: {
        projectId,
      },
      include: {
        employee: true,
      },
    });

    const activeMembers = members
      .filter((member) => member.endWork == null)
      .map((member) => member);

    const pastMembers = members
      .filter((member) => member.endWork != null)
      .map((member) => member);

    return {
      proposedMembers,
      activeMembers,
      pastMembers,
    };
  }

  async getEmployeeProjects(employeeId: string) {
    const employee = await this.prismaService.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    const employeeProjects = await this.prismaService.employeeProject.findMany({
      where: {
        employeeId,
      },
      select: {
        id: true,
        employee: {
          select: {
            id: true,
            name: true,
          },
        },
        workHours: true,
        endWork: true,
        employeeRoles: true,
        project: {
          select: {
            id: true,
            technologyStack: true,
            name: true,
          },
        },
      },
    });

    const currentProjects = employeeProjects.filter(
      (project) => project.endWork == null,
    );

    const pastProjects = employeeProjects.filter(
      (project) => project.endWork != null,
    );

    return {
      currentProjects,
      pastProjects,
    };
  }

  async getDepartmentProjects(departmentId: string) {
    const { members } = await this.prismaService.department.findUnique({
      where: {
        id: departmentId,
      },
      include: {
        members: {
          include: {
            projects: {
              include: {
                project: true,
              },
            },
          },
        },
      },
    });

    const uniqueProjects = new Set();

    await Promise.all(
      members.map(async (member) => {
        await Promise.all(
          member.projects.map(async (project) => {
            const projectData = {
              id: project.project.id,
              name: project.project.name,
              deadlineDate: project.project.deadlineDate,
              status: project.project.status,
              members: await this.prismaService.employeeProject.findMany({
                where: { employeeId: member.id },
                select: { employee: { select: { name: true } } },
              }),
            };

            uniqueProjects.add(JSON.stringify(projectData));
          }),
        );
      }),
    );

    const departmentProjects = Array.from(uniqueProjects).map((project) =>
      JSON.parse(project as string),
    );

    return departmentProjects;
  }

  async deallocationProposalUpdate(deallocationId: string, reason: string) {
    const deallocPropasal =
      await this.prismaService.deallocationProposal.findUnique({
        where: { id: deallocationId },
      });
    if (!deallocPropasal) throw new NotFoundException('Proposal not found');

    return await this.prismaService.deallocationProposal.update({
      where: { id: deallocationId },
      data: {
        reason,
      },
    });
  }

  async deallocationProposalDelete(deallocationId: string) {
    const deallocPropasal =
      await this.prismaService.deallocationProposal.findUnique({
        where: { id: deallocationId },
      });
    if (!deallocPropasal) throw new NotFoundException('Proposal not found');

    return await this.prismaService.deallocationProposal.delete({
      where: { id: deallocationId },
    });
  }

  async assignmentProposalUpdate(
    assignmentId: string,
    data: AssignmentProposalDto,
  ) {
    const assignPropasal =
      await this.prismaService.assignmentProposal.findUnique({
        where: { id: assignmentId },
      });
    if (!assignPropasal) throw new NotFoundException('Proposal not found');

    return await this.prismaService.assignmentProposal.update({
      where: { id: assignmentId },
      data: {
        comments: data.comments,
        workHours: data.workHours,
        teamRoles: data.teamRoles,
      },
    });
  }

  async assignmentProposalDelete(assignmentId: string) {
    const assignPropasal =
      await this.prismaService.assignmentProposal.findUnique({
        where: { id: assignmentId },
      });
    if (!assignPropasal) throw new NotFoundException('Proposal not found');

    return await this.prismaService.assignmentProposal.delete({
      where: { id: assignmentId },
    });
  }

  async getProjectAssingProposal(projectId: string) {
    await this.getProject(projectId);
    const projectProposals =
      await this.prismaService.assignmentProposal.findMany({
        where: { projectId },
        include: { employee: true },
      });

    return projectProposals;
  }

  async getProjectDeallocProposal(projectId: string) {
    await this.getProject(projectId);
    const deallocationsProposals =
      await this.prismaService.deallocationProposal.findMany({
        where: { projectId },
        include: { employee: true },
      });

    return deallocationsProposals;
  }
}
