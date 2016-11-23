import {Injectable} from '@angular/core';
import {LocalStorageItem} from './local-storage-item';
import {IUser} from '../../../../../shared/src/model';
import {JwtHelper} from 'angular2-jwt';

@Injectable()
export class AuthenticationService {

  private static AUTH_KEY = 'id_token';

  private authenticationToken: LocalStorageItem<string> = new LocalStorageItem<string>(AuthenticationService.AUTH_KEY);
  private jwtHelper: JwtHelper = new JwtHelper();

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

  public getLoggedInUser(): IUser {
    return this.jwtHelper.decodeToken(this.getAuthenticationToken());
  }

  public logoutUser() {
    this.authenticationToken.deleteCache();
  }

}
