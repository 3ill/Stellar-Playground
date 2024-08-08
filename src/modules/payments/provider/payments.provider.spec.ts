import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsProvider } from './payments.provider';
import { AccountCreationModule } from '@/modules/account_creation/account_creation.module';
import { AccountCreationProvider } from '@/modules/account_creation/provider/account_creation.provider';

describe('Payments', () => {
  let provider: PaymentsProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountCreationModule],
      providers: [PaymentsProvider, AccountCreationProvider],
    }).compile();

    provider = module.get<PaymentsProvider>(PaymentsProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('Asset', () => {
    it('Should list all anchor assets', async () => {
      const currencies = await provider.listAnchorCurrencies('testnet');
      console.log(currencies);
      expect(currencies).toBeDefined();
    });

    it.only('Should get asset code and issuer public key', async () => {
      const assetConfig = await provider.getAssetConfig({
        asset: 'SRT',
        network: 'testnet',
      });

      console.log(assetConfig);
      expect(assetConfig).toBeDefined();
    });
  });
});
