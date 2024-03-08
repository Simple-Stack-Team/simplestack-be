import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class SkillsDto {
  @IsMongoId()
  @IsNotEmpty()
  skillCategoryId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
