import { Test, TestingModule } from '@nestjs/testing';
import { AccountCreationService } from './account_creation.service';
import { AccountCreation } from '../provider/account_creation';

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
  });
});
