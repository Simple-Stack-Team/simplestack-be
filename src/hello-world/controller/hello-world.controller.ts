import { Controller, Get } from '@nestjs/common';

@Controller()
export class HelloWorldController {
  @Get()
  helloWorld() {
    return { msg: 'Hello World' };
  }
}
