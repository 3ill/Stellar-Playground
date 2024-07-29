import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AccountCreation } from '../provider/account_creation';
import {
  AccountBalanceInterface,
  AccountCreationInterface,
  StellarNetworkType,
} from '../interface/account_creation.interface';
import { Keypair } from '@stellar/stellar-sdk';
import { AccountKeypair } from '@stellar/typescript-wallet-sdk';
import {
  TransactionBuilder,
  BASE_FEE,
  Networks,
  Memo,
  Operation,
} from 'stellar-sdk';

@Injectable()
export class AccountCreationService {
  constructor(private readonly provider: AccountCreation) {}

  createKeyPair(network: StellarNetworkType) {
    try {
      const account = this.provider.provideAccount(network);
      const keyPair = account.createKeypair();
      if (!keyPair) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Could not create keypair',
        };
      }

      const publicKey = keyPair.publicKey;
      const secretKey = keyPair.secretKey;

      const keyObject = {
        publicKey,
        secretKey,
      };

      return {
        status: HttpStatus.OK,
        keyObject,
        data: keyPair,
        message: 'Keypair created successfully',
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  private deriveKeypair(privateKey: string) {
    const keyPair = Keypair.fromSecret(privateKey);
    return new AccountKeypair(keyPair);
  }

  private async accountCreationConfig(args: AccountCreationInterface) {
    const { network, payerPrivateKey } = args;
    const server = this.provider.provideStellarServer(network).server;
    const payerKeyPair = this.deriveKeypair(payerPrivateKey);
    const sourceAccount = await server.loadAccount(payerKeyPair.publicKey);

    return {
      server,
      payerKeyPair,
      sourceAccount,
    };
  }

  async createAccount(args: AccountCreationInterface) {
    const { network, payerPrivateKey } = args;
    try {
      const { server, payerKeyPair, sourceAccount } =
        await this.accountCreationConfig({
          network,
          payerPrivateKey,
        });
      const destinationAccountConfig = this.createKeyPair(network);
      const destinationKeyPair = destinationAccountConfig.data;

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
        memo: new Memo('text', 'Account Creation Transactio'),
      })
        .addOperation(
          Operation.createAccount({
            destination: destinationKeyPair.publicKey,
            startingBalance: '100',
          }),
        )
        .setTimeout(30)
        .addMemo(Memo.text('Account Creation Transaction'))
        .build();

      transaction.sign(payerKeyPair.keypair);
      const result = await server.submitTransaction(transaction);

      if (!result) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Could not create account',
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'Account created successfully',
        data: result.hash,
        recipientData: destinationAccountConfig.keyObject,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getAccountBalance(args: AccountBalanceInterface) {
    const { network, publicKey } = args;
    try {
      const server = this.provider.provideStellarServer(network).server;
      const account = server.loadAccount(publicKey);
      const balance = (await account).balances;
      return balance;
    } catch (error) {
      error;
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
