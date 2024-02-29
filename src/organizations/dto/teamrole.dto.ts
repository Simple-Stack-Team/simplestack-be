import { IsNotEmpty, IsString } from 'class-validator';

export class TeamRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
