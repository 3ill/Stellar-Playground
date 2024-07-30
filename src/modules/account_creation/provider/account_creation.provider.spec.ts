import { Test, TestingModule } from '@nestjs/testing';
import { AccountCreationProvider } from './account_creation.provider';
import { AnchorDomains } from '../interface/account_creation.interface';
import { ADMIN_TEST_PUBLIC_KEY } from '@/shared/constants/constants';

describe('AccountCreation', () => {
  let provider: AccountCreationProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountCreationProvider],
    }).compile();

    provider = module.get<AccountCreationProvider>(AccountCreationProvider);
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

  describe('Account', () => {
    it('Should return a valid account config', () => {
      const account = provider.provideAccount('testnet');
      console.log(account);
    });

    it.only('should return account signers', async () => {
      const server = provider.provideStellarServer('testnet').server;
      const account = server.loadAccount(ADMIN_TEST_PUBLIC_KEY);

      const signers = (await account).signers;
      console.log(signers);

      expect(signers).toBeDefined();
      expect(signers.length).toBe(2);
      expect(signers[1].key).toBe(ADMIN_TEST_PUBLIC_KEY);
      expect(signers[0].weight).toBe(3);
    });
  });

  describe('Faucet', () => {
    it('should send some test XLM', async () => {
      const result = await provider.faucet(
        'GCZHGZFQ6NQOUFDO6KEVPDLVPXWQLRVKBELXZLI7WNV5YRKM7DF24HFT',
      );
      console.log(result);
    });
  });
});
