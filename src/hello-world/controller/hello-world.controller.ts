import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Public } from 'src/auth/decorators/public.decorator';

@Public()
@Controller()
export class HelloWorldController {
  constructor(private configService: ConfigService) {}
  configTest = this.configService.get<string>('CONFIG_TEST');

  @Get()
  helloWorld() {
    return { msg: this.configTest };
  }
}
