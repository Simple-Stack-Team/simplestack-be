import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { SkillsDto } from 'src/skills/dto/create-updates-skills.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignSkillDto } from 'src/skills/dto/assign-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSkillCategory(orgId: string, name: string) {
    const org = await this.prismaService.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) throw new HttpException('Organization not found', 404);

    return await this.prismaService.skillCategory.create({
      data: {
        organizationId: orgId,
        name: name,
      },
    });
  }

  async getSkillsCategories(orgId: string) {
    const org = await this.prismaService.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) throw new HttpException('Organization not found', 404);

    return await this.prismaService.skillCategory.findMany({
      where: { organizationId: orgId },
    });
  }

  async getSkills(orgId: string) {
    const org = await this.prismaService.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) throw new HttpException('Organization not found', 404);

    return await this.prismaService.skill.findMany({
      where: { organizationId: orgId },
      include: { category: true },
    });
  }

  async getSkillById(id: string) {
    const skill = await this.prismaService.skill.findUnique({
      where: { id },
      include: {
        author: true,
        departments: true,
        category: true,
        organization: true,
      },
    });
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  async updateSkillCategory(id: string, name: string) {
    const skillCategory = await this.prismaService.skillCategory.findUnique({
      where: { id },
    });
    if (!skillCategory)
      throw new HttpException('Skill category not found', 404);

    return await this.prismaService.skillCategory.update({
      where: { id },
      data: {
        name: name,
      },
    });
  }

  async deleteSkillCategory(id: string) {
    const skillCategory = await this.prismaService.skillCategory.findUnique({
      where: { id },
    });
    if (!skillCategory)
      throw new HttpException('Skill Category not found', 404);

    await this.prismaService.skill.deleteMany({
      where: { categoryId: id },
    });

    return await this.prismaService.skillCategory.delete({
      where: { id },
    });
  }

  async createSkill(orgId: string, authorId: string, data: SkillsDto) {
    const author = await this.prismaService.employee.findUnique({
      where: { id: authorId, organizationId: orgId },
    });
    if (!author) throw new HttpException('Employee not found', 404);

    const skillCategory = await this.prismaService.skillCategory.findUnique({
      where: { id: data.skillCategoryId },
    });
    if (!skillCategory)
      throw new HttpException('Skill category is not found', 404);

    return await this.prismaService.skill.create({
      data: {
        name: data.name,
        authorId: authorId,
        description: data.description,
        categoryId: data.skillCategoryId,
        organizationId: orgId,
      },
    });
  }

  async updateSkill(skillId: string, authorId: string, data: SkillsDto) {
    const skill = await this.prismaService.skill.findUnique({
      where: { id: skillId },
    });
    if (!skill) throw new HttpException('Skill not found', 404);
    if (skill.authorId !== authorId)
      throw new HttpException('You have no rights to update this skill', 409);

    return await this.prismaService.skill.update({
      where: { id: skillId, authorId },
      data: {
        name: data.name,
        authorId: authorId,
        description: data.description,
        categoryId: data.skillCategoryId,
      },
    });
  }

  async deleteSkill(skillId: string, authorId: string) {
    const skill = await this.prismaService.skill.findUnique({
      where: { id: skillId },
    });
    if (!skill) throw new HttpException('Skill not found', 404);
    if (skill.authorId !== authorId)
      throw new HttpException('You have no rights to delete this skill', 403);

    return await this.prismaService.skill.delete({
      where: { id: skillId },
    });
  }

  async assignSkillToDepartment(
    skillId: string,
    depId: string,
    managerId: string,
  ) {
    const dep = await this.prismaService.department.findUnique({
      where: { id: depId },
      include: { manager: true },
    });
    if (!dep) throw new HttpException('Department not found', 404);
    if (dep.managerId !== managerId)
      throw new HttpException(
        'Only department manager of this department can assign skill',
        403,
      );
    const skill = await this.prismaService.skill.findUnique({
      where: { id: skillId },
    });
    if (!skill) throw new HttpException('Skill not found', 404);
    if (skill.departmentIds.includes(depId))
      throw new HttpException('Department already contains this skill', 409);

    await this.prismaService.department.update({
      where: { id: depId },
      data: {
        skillIds: {
          push: skillId,
        },
      },
    });

    await this.prismaService.skill.update({
      where: { id: skillId },
      data: {
        departmentIds: {
          push: depId,
        },
      },
    });

    return await this.prismaService.skill.findUnique({
      where: { id: skillId },
      include: {
        departments: true,
      },
    });
  }

  async deleteSkillFromDepartment(
    skillId: string,
    depId: string,
    managerId: string,
  ) {
    const dep = await this.prismaService.department.findUnique({
      where: { id: depId },
    });
    if (!dep) throw new HttpException('Department not found', 404);
    if (dep.managerId !== managerId)
      throw new HttpException('You have no rights for this action', 403);
    if (!dep.skillIds.includes(skillId))
      throw new HttpException('Department do not contains this skill', 409);

    const skill = await this.prismaService.skill.findUnique({
      where: { id: skillId },
    });
    if (!skill) throw new HttpException('Skill not found', 404);
    if (!skill.departmentIds.includes(depId))
      throw new HttpException('Department do not contains this skill', 409);

    const newDep = skill.departmentIds.filter((id) => {
      if (id !== depId) {
        return id;
      }
    });

    await this.prismaService.skill.update({
      where: { id: skillId },
      data: {
        departmentIds: {
          set: newDep,
        },
      },
    });

    const newSkills = dep.skillIds.filter((id) => {
      if (skillId !== id) {
        return id;
      }
    });

    return await this.prismaService.department.update({
      where: { id: depId },
      data: {
        skillIds: {
          set: newSkills,
        },
      },
    });
  }

  async assignSkill(orgId: string, skillAssign: AssignSkillDto) {
    const org = await this.prismaService.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) throw new HttpException('Organization not found', 404);

    const employee = await this.prismaService.employee.findUnique({
      where: { id: skillAssign.employeeId },
    });
    if (!employee) throw new HttpException('Employee not found', 404);

    const skill = await this.prismaService.skill.findUnique({
      where: { id: skillAssign.skillId },
    });
    if (!skill) throw new HttpException('Skill not found', 404);

    return await this.prismaService.skillAssignment.create({
      data: {
        level: skillAssign.level,
        experience: skillAssign.experience,
        skillId: skillAssign.skillId,
        employeeId: skillAssign.employeeId,
      },
    });
  }

  async removeSkillFromEmployee(
    orgId: string,
    skillAssignmentId: string,
    empId: string,
  ) {
    const org = await this.prismaService.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) throw new HttpException('Organization not found', 404);

    const employee = await this.prismaService.employee.findUnique({
      where: { id: empId },
      include: { personalSkills: true },
    });
    if (!employee) throw new HttpException('Employee not found', 404);

    const skillAssign = await this.prismaService.skillAssignment.findUnique({
      where: { id: skillAssignmentId },
    });
    if (!skillAssign)
      throw new HttpException('Assignmented skill not found', 404);

    return await this.prismaService.skillAssignment.delete({
      where: { id: skillAssignmentId },
    });
  }
}
