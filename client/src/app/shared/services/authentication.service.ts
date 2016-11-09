import {Injectable} from '@angular/core';
import {LocalStorageItem} from './local-storage-item';
import {IUser} from '../../../../../shared/src/model';
import {Base64} from 'js-base64';

@Injectable()
export class AuthenticationService {

  private static AUTH_KEY = 'authToken';

  private authenticationToken: LocalStorageItem<string> = new LocalStorageItem<string>(AuthenticationService.AUTH_KEY);

  constructor() {
  }

  public getAuthenticationToken(): string {
    if (this.authenticationToken.isStored()) {
      return this.authenticationToken.readCache();
    }
    return null;
  }

  public setAuthenticationToken(token: string) {
    this.authenticationToken.writeCache(token);
  }

  public isUserLoggedIn(): boolean {
    return this.authenticationToken.isStored();
  }

  //ToDo use jwt for decoding. (still some Problems with adding jsonwebtoken to the cli projekt with webpack...)
  public getLoggedInUser(): IUser {
    let tokenParts: string[] = this.getAuthenticationToken().split('.');
    let userString = Base64.decode(tokenParts[1]);
    return JSON.parse(Base64.decode(tokenParts[1])); //decode(this.getAuthenticationToken());
  }

  public logoutUser() {
    this.authenticationToken.deleteCache();
  }
}
