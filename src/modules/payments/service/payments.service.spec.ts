import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { AccountCreationModule } from '@/modules/account_creation/account_creation.module';
import { PaymentsProvider } from '../provider/payments.provider';
import { AccountCreationProvider } from '@/modules/account_creation/provider/account_creation.provider';
import { ADMIN_TEST_PRIVATE_KEY } from '@/shared/constants/constants';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountCreationModule],
      providers: [PaymentsService, PaymentsProvider, AccountCreationProvider],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Trustlines', () => {
    it('should successfully init trustline with an anchor', async () => {
      const response = await service.establishTrustLine({
        network: 'testnet',
        asset: 'USDC',
        privateKey: ADMIN_TEST_PRIVATE_KEY,
      });

      console.log(response);
      expect(response).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.message).toBe('Trust line established successfully');
      expect(response.result).toBeDefined();
      expect(response.result).toBeTruthy();
    }, 50000);
  });
});
