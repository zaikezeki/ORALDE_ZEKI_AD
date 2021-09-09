import { Test, TestingModule } from '@nestjs/testing';
import { Excercise3Service } from './excercise3.service';

describe('Excercise3Service', () => {
  let service: Excercise3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Excercise3Service],
    }).compile();

    service = module.get<Excercise3Service>(Excercise3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
