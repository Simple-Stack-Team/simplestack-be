import { IsNotEmpty, IsString } from 'class-validator';

export class skillCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
