import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { AuthService } from 'src/auth/auth.service';
import { SignUpAdminDto } from 'src/auth/dto/auth-signup-org.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { LoginDto } from 'src/auth/dto/auth-login.dto';
import { SignUpEmployeeDto } from 'src/auth/dto/auth-signup-emp.dto';

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginDto: LoginDto) {
    return await this.authService.logIn(loginDto.email, loginDto.password);
  }

  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exist',
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid body data',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signupAdmin(@Body() signupAdmin: SignUpAdminDto) {
    return await this.authService.signUpAdmin(signupAdmin);
  }

  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exist',
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid body data',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post(':orgId/signup')
  async signUpEmployee(
    @Param('orgId') orgId: string,
    @Body() signUpEmployee: SignUpEmployeeDto,
  ) {
    return await this.authService.signUpEmployee(orgId, signUpEmployee);
  }
}
