import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpAdminDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  organizationName: string;

  @IsNotEmpty()
  @IsString()
  headquarterAddress: string;
}
