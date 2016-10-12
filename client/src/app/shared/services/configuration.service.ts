import {Injectable} from '@angular/core';

@Injectable()
export class ConfigurationService {

  private static serverRestApiBaseUrl: string = 'localhost:3000/rest';


  constructor() {
  }

  public get userEndpoint(): string {
    return ConfigurationService.serverRestApiBaseUrl + '/users';
  }

  public get retrospectiveEndpoint(): string {
    return ConfigurationService.serverRestApiBaseUrl + '/retrospectives';
  }

}
