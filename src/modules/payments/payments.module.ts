import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './service/payments.service';
import { PaymentsProvider } from './provider/payments.provider';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AccountCreationModule } from '../account_creation/account_creation.module';

@Module({
  imports: [AuthenticationModule, forwardRef(() => AccountCreationModule)],
  providers: [PaymentsService, PaymentsProvider],
  exports: [PaymentsService, PaymentsProvider],
})
export class PaymentsModule {}
