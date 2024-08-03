import { AccountCreationProvider } from '@/modules/account_creation/provider/account_creation.provider';
import { AccountCreationService } from '@/modules/account_creation/service/account_creation.service';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly accountCreationService: AccountCreationService,
    private readonly accountCreationProvider: AccountCreationProvider,
  ) {}

  async authenticate() {
    const keyPair = this.accountCreationService.createKeyPair('testnet');

    if (!keyPair) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Could not create keypair',
      };
    }
    const keyObjects = keyPair.keyObject;
    if (!keyObjects) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Could not create keypair',
      };
    }
    const anchor = this.accountCreationProvider.provideAnchor({
      network: 'testnet',
    });

    const sep10 = await anchor.sep10();
    const authToken = await sep10.authenticate({ accountKp: keyPair.data });
    if (!authToken) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Could not authenticate',
      };
    }
    return {
      status: HttpStatus.OK,
      message: 'Authentication successful',
      data: authToken,
      keys: keyObjects,
    };
  }
}
