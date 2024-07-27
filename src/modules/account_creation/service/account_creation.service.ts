import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AccountCreation } from '../provider/account_creation';
import {
  AccountBalanceInterface,
  StellarNetworkType,
} from '../interface/account_creation.interface';

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
