import { Test, TestingModule } from '@nestjs/testing';
import { AccountCreationService } from './account_creation.service';

describe('AccountCreationService', () => {
  let service: AccountCreationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountCreationService],
    }).compile();

    service = module.get<AccountCreationService>(AccountCreationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
