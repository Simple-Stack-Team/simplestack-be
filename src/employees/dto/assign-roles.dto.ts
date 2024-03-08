import { Role } from '@prisma/client';
import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';

export class RolesDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  roles: Role[];
}
