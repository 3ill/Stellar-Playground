import { Test, TestingModule } from '@nestjs/testing';
import { AccountCreationController } from './account_creation.controller';

describe('AccountCreationController', () => {
  let controller: AccountCreationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountCreationController],
    }).compile();

    controller = module.get<AccountCreationController>(
      AccountCreationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
