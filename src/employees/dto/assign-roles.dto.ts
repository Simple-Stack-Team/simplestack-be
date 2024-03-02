import { Role } from '@prisma/client';
import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';

export class rolesDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  roles: Role[];
}
