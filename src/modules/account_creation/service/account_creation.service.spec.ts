import { Test, TestingModule } from '@nestjs/testing';
import { AccountCreationService } from './account_creation.service';
import { AccountCreation } from '../provider/account_creation';
import { ADMIN_TEST_PRIVATE_KEY } from '@/shared/constants/constants';

describe('AccountCreationService', () => {
  let service: AccountCreationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountCreationService, AccountCreation],
    }).compile();

    service = module.get<AccountCreationService>(AccountCreationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('KeyPairs', () => {
    it('Should successfully create a keypair', async () => {
      const keyPair = service.createKeyPair('testnet');
      console.log(keyPair);
      expect(keyPair).toBeDefined();
      expect(keyPair.status).toBe(200);
      expect(keyPair.message).toBe('Keypair created successfully');
      expect(keyPair.keyObject).toBeDefined();
      expect(keyPair.keyObject.publicKey).toBeDefined();
      expect(keyPair.keyObject.secretKey).toBeDefined();
    });

    it('should check balance of a public key', async () => {
      const balanceArray = await service.getAccountBalance({
        network: 'testnet',
        publicKey: 'GASQVJ4TC5B2DZES247AWFGWP2YKL7JGQXZVSA5F32LKBXB3CUS2Y743',
      });

      const balanceObject: { asset_type: string; balance: string }[] = [];

      balanceArray.flatMap((balance) =>
        balanceObject.push({
          asset_type: balance.asset_type,
          balance: balance.balance,
        }),
      );

      console.log(balanceObject);
    });
  });

  describe('Account Creation', () => {
    it.only('should successfully create a new account', async () => {
      const account = await service.createAccount({
        network: 'testnet',
        payerPrivateKey: ADMIN_TEST_PRIVATE_KEY,
      });

      console.log(account);
    });
  });
});
