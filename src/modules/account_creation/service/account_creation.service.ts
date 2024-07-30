import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AccountCreationProvider } from '../provider/account_creation.provider';
import {
  AccountBalanceInterface,
  AccountCreationInterface,
  StellarNetworkType,
} from '../interface/account_creation.interface';
import { Keypair } from '@stellar/stellar-sdk';
import { AccountKeypair } from '@stellar/typescript-wallet-sdk';
import { Memo, Operation } from 'stellar-sdk';

@Injectable()
export class AccountCreationService {
  constructor(private readonly provider: AccountCreationProvider) {}

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
      const { server, payerKeyPair } = await this.accountCreationConfig({
        network,
        payerPrivateKey,
      });
      const destinationAccountConfig = this.createKeyPair(network);
      const destinationKeyPair = destinationAccountConfig.data;

      const builder = await this.provider.initializeTransaction({
        network,
        keyPair: payerKeyPair,
      });

      const transaction = builder
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

  async changeAccountMasterKey(args: AccountCreationInterface) {
    const { network, payerPrivateKey } = args;
    try {
      const { server, payerKeyPair } = await this.accountCreationConfig({
        network,
        payerPrivateKey,
      });
      const destinationAccountConfig = this.createKeyPair(network);
      const destinationKeyPair = destinationAccountConfig.data;

      const builder = this.provider.initializeTransaction({
        network,
        keyPair: payerKeyPair,
      });

      const tx = (await builder)
        .addOperation(
          Operation.setOptions({
            signer: {
              ed25519PublicKey: destinationKeyPair.publicKey,
              weight: 3,
            },
          }),
        )
        .addOperation(
          Operation.setOptions({
            masterWeight: 0,
            lowThreshold: 1,
            medThreshold: 2,
            highThreshold: 3,
          }),
        )
        .addMemo(Memo.text('Master key changed'))
        .setTimeout(30)
        .build();

      tx.sign(payerKeyPair.keypair);
      const result = await server.submitTransaction(tx);
      if (!result) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Could not change account master key',
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'Account master key changed successfully',
        data: result.hash,
        recipientData: destinationAccountConfig.keyObject,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
