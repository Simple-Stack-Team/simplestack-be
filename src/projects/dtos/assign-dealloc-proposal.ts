import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class AssignmentProposalDto {
  @IsInt()
  @Min(1)
  @Max(8)
  workHours: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  teamRoles: string[];

  @IsString()
  comments: string;
}

export class DeallocationProposalDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}
