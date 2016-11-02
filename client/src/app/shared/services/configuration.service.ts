import {Injectable} from '@angular/core';

@Injectable()
export class ConfigurationService {


  private static serverHostUrl: string = 'http://localhost:3000';

  private static serverRestApiBaseUrl: string = ConfigurationService.serverHostUrl + '/rest';

  //Endpoints
  private static userEndpoint: string = '/users';
  private static retrospectiveEndpoint: string = '/retrospectives';

  constructor() {
  }

  public get serverHostUrl(): string {
    return ConfigurationService.serverHostUrl;
  }

  public get restApiBaseUrl(): string {
    return ConfigurationService.serverRestApiBaseUrl;
  }

  public get userEndpoint(): string {
    return ConfigurationService.serverRestApiBaseUrl + ConfigurationService.userEndpoint;
  }

  public get retrospectiveEndpoint(): string {
    return ConfigurationService.serverRestApiBaseUrl + ConfigurationService.retrospectiveEndpoint;
  }

}
