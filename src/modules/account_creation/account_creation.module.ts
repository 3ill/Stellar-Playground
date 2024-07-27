import { Module } from '@nestjs/common';
import { AccountCreationService } from './service/account_creation.service';
import { AccountCreation } from './provider/account_creation';
import { AccountCreationController } from './controller/account_creation.controller';

@Module({
  providers: [AccountCreationService, AccountCreation],
  controllers: [AccountCreationController],
})
export class AccountCreationModule {}
