import { Test, TestingModule } from '@nestjs/testing';
import { Excercise3Controller } from './excercise3.controller';

describe('Excercise3Controller', () => {
  let controller: Excercise3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Excercise3Controller],
    }).compile();

    controller = module.get<Excercise3Controller>(Excercise3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
