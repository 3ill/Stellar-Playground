import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { AccountCreationModule } from '@/modules/account_creation/account_creation.module';
import { AccountCreationProvider } from '@/modules/account_creation/provider/account_creation.provider';
import { AccountCreationService } from '@/modules/account_creation/service/account_creation.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountCreationModule],
      providers: [
        AuthenticationService,
        AccountCreationProvider,
        AccountCreationService,
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Authentication', () => {
    it('should return an authentication token', async () => {
      const data = await service.authenticate();
      console.log(data);
      expect(data).toBeDefined();
    });
  });
});
