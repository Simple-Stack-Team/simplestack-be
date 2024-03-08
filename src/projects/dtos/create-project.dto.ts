import {
  IsString,
  IsInt,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ProjectPeriod, ProjectStatus } from 'src/projects/types/project-types';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ProjectPeriod)
  period: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string | Date;

  @IsOptional()
  @IsDateString()
  deadlineDate: string | Date;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty()
  technologyStack: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProjectTeamRoleDto)
  teamRoles: ProjectTeamRoleDto[];
}

export class ProjectTeamRoleDto {
  @IsString()
  @IsNotEmpty()
  teamroleId: string;

  @IsInt()
  @IsNotEmpty()
  nrOfMembers: number;
}
