import { Module } from '@nestjs/common';
import { Excercise3Controller } from './excercise3.controller';
import { Excercise3Service } from './excercise3.service';

@Module({
  controllers: [Excercise3Controller],
  providers: [Excercise3Service]
})
export class Excercise3Module {}
