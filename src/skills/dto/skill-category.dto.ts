import { IsNotEmpty, IsString } from 'class-validator';

export class SkillCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
