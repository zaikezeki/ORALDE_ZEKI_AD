import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Excercise3Module } from './excercise3/excercise3.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [Excercise3Module, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
