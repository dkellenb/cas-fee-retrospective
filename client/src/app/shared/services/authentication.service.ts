import {Injectable} from '@angular/core';
import {LocalStorageItem} from './local-storage-item';

@Injectable()
export class AuthenticationService {

  private static AUTH_KEY = 'authToken';

  private authenticationToken: LocalStorageItem<string> = new LocalStorageItem<string>(AuthenticationService.AUTH_KEY);

  constructor() {
  }

  getAuthenticationToken(): string {
    if (this.authenticationToken.isStored()) {
      return this.authenticationToken.readCache();
    }
    return null;
  }

  setAuthenticationToken(token: string) {
    this.authenticationToken.writeCache(token);
  }

}
