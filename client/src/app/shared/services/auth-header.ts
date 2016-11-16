import {Headers} from '@angular/http';
export class AuthHeader {

  public static appendAuthHeader(headers: Headers, token: string): Headers {
    headers.append('Authorization', 'Bearer ' + token);
    return headers;
  }
}
