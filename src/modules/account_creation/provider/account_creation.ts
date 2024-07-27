import { Injectable } from '@nestjs/common';
import { Wallet } from '@stellar/typescript-wallet-sdk';

@Injectable()
export class AccountCreation {
  provideWallet() {
    const wallet = Wallet.TestNet();
    return wallet;
  }
}
