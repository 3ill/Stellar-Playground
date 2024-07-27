import { Test, TestingModule } from '@nestjs/testing';
import { AccountCreation } from './account_creation';

describe('AccountCreation', () => {
  let provider: AccountCreation;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountCreation],
    }).compile();

    provider = module.get<AccountCreation>(AccountCreation);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
