import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';
import {AuthenticationService, ConfigurationService} from '../../shared';
import {AuthHttp} from 'angular2-jwt';
import {CreateUserJSON, IUser} from '../../../../../shared/src/model';

@Injectable()
export class UserService {

  constructor(private http: Http, private authHttp: AuthHttp, private configuration: ConfigurationService,
              private authentication: AuthenticationService) {

  }

  public getUsers(): Observable<IUser[]> {
    return this.http.get(this.configuration.userEndpoint).map(res => {
      return res.json();
    });
  }

  public createUser(shortName: string, name?: string, email?: string): Observable<boolean> {
    let createUserJSON = <CreateUserJSON>{};
    createUserJSON.shortName = shortName;
    createUserJSON.name = name;
    createUserJSON.email = email;
    return this.http.post(this.configuration.userEndpoint, createUserJSON, {withCredentials: true}).flatMap(
      res => {
        let location: string = res.headers.get('Location');
        return this.lookupAuthToken(location).map(
          authToken => {
            console.log('Token retrieved: ' + authToken);
            this.authentication.setAuthenticationToken(authToken);
            return true;
          },
          e => {
            console.error(e);
            return false;
          });
      });
  }

  public lookupAuthToken(location: string): Observable<string> {
    return this.http.get(this.configuration.serverHostUrl + location, {withCredentials: true}).map(
      res => {
        if (res.status === 200) {
          return res.text();
        } else {
          throw new Error('wasn\'t able to get user token');
        }
      });
  }


  public getUser(id: string): Observable < IUser > {
    return this.authHttp.get(this.createUserIdEndpoint(id)).map(res => {
      return res.json();
    });
  }

  public updateUser(id: string, user: IUser): Observable < IUser > {
    return this.authHttp.get(this.createUserIdEndpoint(id)).map(res => {
      return res.json();
    });
  }

  public deleteUser(id: string): Observable < IUser > {
    return this.authHttp.delete(this.createUserIdEndpoint(id)).map(res => {
      return res.json();
    });
  }

  private createUserIdEndpoint(id: string) {
    return this.configuration.userEndpoint + '/' + id;
  }
}
