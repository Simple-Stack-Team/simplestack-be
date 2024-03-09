import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
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
  teamRoles: string[];

  @IsString()
  comments: string;
}
