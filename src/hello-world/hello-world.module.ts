import { Module } from '@nestjs/common';

import { HelloWorldController } from 'src/hello-world/controller/hello-world.controller';

@Module({
  controllers: [HelloWorldController],
})
export class HelloWorldModule {}
