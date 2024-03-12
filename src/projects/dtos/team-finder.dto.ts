import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

import { toBoolean } from 'src/projects/utils/dto-transform.util';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TeamFinderQueryDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  includePartiallyAvailable: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  includeCloseToFinish: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  includeUnavailable: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  includePastProjects: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(6)
  deadlineWeeks: number;
}
