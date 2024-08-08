import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaymentsProvider } from '../provider/payments.provider';
import { TrustInterface } from '../interface/payments.interface';
import { IssuedAssetId } from '@stellar/typescript-wallet-sdk';

@Injectable()
export class PaymentsService {
  constructor(private readonly paymentsProvider: PaymentsProvider) {}

  async establishTrustLine(args: TrustInterface) {
    const { network, asset, domain, privateKey } = args;
    const keyConfig = this.paymentsProvider.returnKeyPairConfig(privateKey);
    const { AccountKeyPair, signer } = keyConfig;
    try {
      const stellar = await this.paymentsProvider.returnStellarServer(network);
      const assetConfig = await this.paymentsProvider.getAssetConfig({
        network,
        domain,
        asset,
      });

      console.log('asset config returned');

      if ('code' in assetConfig && 'issuer' in assetConfig) {
        const { code, issuer } = assetConfig;
        const txBuilder = stellar.transaction({
          sourceAddress: AccountKeyPair,
        });
        const newAsset = new IssuedAssetId(code, issuer);
        const tx = (await txBuilder).addAssetSupport(newAsset, '10000').build();
        signer.sign(tx);
        const result = await stellar.submitTransaction(tx);
        return {
          status: HttpStatus.OK,
          message: 'Trust line established successfully',
          result,
        };
      } else {
        throw new Error('Invalid asset configuration');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.extras) {
        console.error('Result codes:', error.response.data.extras.result_codes);
      }
      throw new HttpException(
        {
          message: error.message,
          resultCodes: error.response?.data?.extras?.result_codes,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
