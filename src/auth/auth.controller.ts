import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { SignUpAdminDto } from 'src/auth/dto/auth-signup-org.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { LoginDto } from 'src/auth/dto/auth-login.dto';
import { SignUpEmployeeDto } from 'src/auth/dto/auth-signup-emp.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginDto: LoginDto) {
    return await this.authService.logIn(loginDto.email, loginDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signupAdmin(@Body() signupAdmin: SignUpAdminDto) {
    return await this.authService.signUpAdmin(signupAdmin);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(':orgId/signup')
  async signUpEmployee(
    @Param('orgId') orgId: string,
    @Body() signUpEmployee: SignUpEmployeeDto,
  ) {
    return await this.authService.signUpEmployee(orgId, signUpEmployee);
  }
}
