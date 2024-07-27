import { Test, TestingModule } from '@nestjs/testing';
import { AccountCreation } from './account_creation';
import { AnchorDomains } from '../interface/account_creation.interface';

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

  describe('Wallets', () => {
    it('Should provide correct network config for wallets', () => {
      const testWallet = provider.provideWallet('testnet');
      const mainWallet = provider.provideWallet('mainnet');
      console.log(testWallet);
      console.log(mainWallet);

      expect(testWallet).toBeDefined();
      expect(mainWallet).toBeDefined();
    });

    it('Should successfully return a stellar server', () => {
      const server = provider.provideStellarServer('testnet');
      expect(server).toBeDefined();
      console.log(server);
    });
  });

  describe('Anchors', () => {
    it('Should successfully return an anchor home domain url', () => {
      const domain = provider.provideAnchorDomain();
      console.log(domain);
      expect(domain).toBeDefined();
      expect(domain).toBe(AnchorDomains.DEFAULT);
    });

    it('Should return an anchor config', async () => {
      const anchor = provider.provideAnchor({ network: 'testnet' });
      expect(anchor).toBeDefined();
    });
  });
});
