import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationProvider } from './authentication.provider';

describe('Authentication', () => {
  let provider: AuthenticationProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationProvider],
    }).compile();

    provider = module.get<AuthenticationProvider>(AuthenticationProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
