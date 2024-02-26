import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class HelloWorldController {
  constructor(private configService: ConfigService) {}
  configTest = this.configService.get<string>('CONFIG_TEST');

  @Get()
  helloWorld() {
    return { msg: this.configTest };
  }
}
