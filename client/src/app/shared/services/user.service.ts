import {Injectable} from '@angular/core';
import {ConfigurationService} from './configuration.service';
import {Http} from '@angular/http';
import {IUser, CreateUserJSON} from '../../../../../shared/src/model';
import {Observable} from 'rxjs';

@Injectable()
export class UserService {

  constructor(private http: Http, private configuration: ConfigurationService) {

  }

  public getUsers(): Observable<IUser[]> {
    return this.http.get(this.configuration.userEndpoint).map(res => {
      return res.json();
    });
  }

  public createUser(shortName: string, name?: string, email?: string): Observable<IUser> {

    let createUserJSON = <CreateUserJSON>{};
    createUserJSON.shortName = shortName;
    createUserJSON.name = name;
    createUserJSON.email = email;

    return this.http.post(this.configuration.userEndpoint, createUserJSON).map(res => {
      return res.json();
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
