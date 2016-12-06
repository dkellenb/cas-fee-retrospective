import { injectable } from 'inversify';
import * as nconf from 'nconf';

export interface UserJwtKeyProvider {

  /**
   * Get the key for the JWT decoding / signing.
   *
   * @returns {string} the key
   */
  getKey(): string;
}

@injectable()
export class UserStaticJwtKeyProvider implements UserJwtKeyProvider {

  private static key: string;

  public getKey(): string {
    if (!UserStaticJwtKeyProvider.key) {
      UserStaticJwtKeyProvider.key = process.env.JWT_KEY || nconf.get('jwt-key');
    }
    return UserStaticJwtKeyProvider.key;
  }

}

