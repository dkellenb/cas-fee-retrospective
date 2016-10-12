import { injectable } from 'inversify';

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

  /** temporary secret. this will be changed later on. */
  private static readonly JWT_KEY = 'V6LjnzR0mhQm2Ad81k8j';

  public getKey(): string {
    return UserStaticJwtKeyProvider.JWT_KEY;
  }

}

