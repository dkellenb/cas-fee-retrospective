import {Injectable} from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class ConfigurationService {


  private static serverHostUrl: string = environment.serverUrl;

  private static serverRestApiBaseUrl: string = ConfigurationService.serverHostUrl + '/rest';

  private static serverSocketBaseUrl: string = '/socket';

  // Endpoints
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

  public get webSocketUrl(): string {
    return ConfigurationService.serverSocketBaseUrl;
  }

}
