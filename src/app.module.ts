import { Module } from '@nestjs/common';

import { AppService } from 'src/app.service';
import { HelloWorldModule } from 'src/hello-world/hello-world.module';
import { HelloWorldController } from 'src/hello-world/controller/hello-world.controller';

@Module({
  imports: [HelloWorldModule],
  controllers: [HelloWorldController],
  providers: [AppService],
})
export class AppModule {}
