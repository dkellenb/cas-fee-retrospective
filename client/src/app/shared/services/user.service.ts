import {Injectable} from '@angular/core';
import {ConfigurationService} from './configuration.service';
import {Http} from '@angular/http';
import {IUser, CreateUserJSON} from '../../../../../shared/src/model';
import 'rxjs/Rx';
import {Observable} from "rxjs/Rx";
import {AuthenticationService} from './authentication.service';

@Injectable()
export class UserService {

  constructor(private http: Http, private configuration: ConfigurationService, private authentication: AuthenticationService) {

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

    return this.http.post(this.configuration.userEndpoint, createUserJSON, {withCredentials: true}).map(res => {
      let location: string = res.headers.get('Location');
      this.lookupAuthToken(location).subscribe(authToke => {
        this.authentication.setAuthenticationToken(authToke);
      });
      return true;
    });
  }

  public lookupAuthToken(location: string): Observable<string> {
    return this.http.get(this.configuration.serverHostUrl + location, {withCredentials: true}).map(res => {
      let authToken: string = res.toString();
      console.log('authToken erhalten: ' + authToken);
      return authToken;
    });
  }


  public getUser(id: string): Observable<IUser> {
    return this.http.get(this.createUserIdEndpoint(id)).map(res => {
      return res.json();
    });
  }

  public updateUser(id: string, user: IUser): Observable<IUser> {
    return this.http.get(this.createUserIdEndpoint(id)).map(res => {
      return res.json();
    });
  }

  public deleteUser(id: string): Observable<IUser> {
    return this.http.delete(this.createUserIdEndpoint(id)).map(res => {
      return res.json();
    });
  }

  private createUserIdEndpoint(id: string) {
    return this.configuration.userEndpoint + '/' + id;
  }

}
