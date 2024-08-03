import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsProvider } from './payments.provider';

describe('Payments', () => {
  let provider: PaymentsProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsProvider],
    }).compile();

    provider = module.get<PaymentsProvider>(PaymentsProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
