import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AssignSkillDto {
  @IsMongoId()
  @IsNotEmpty()
  employeeId: string;

  @IsMongoId()
  @IsNotEmpty()
  skillId: string;

  @IsNumber()
  level: number;

  @IsString()
  @IsNotEmpty()
  experience: string;
}
