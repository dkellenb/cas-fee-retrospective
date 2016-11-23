import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {AuthenticationService} from './authentication.service';
import {CreateRetrospectiveJSON, IBasicRetrospective, IRetrospectiveUser} from '../../../../../shared/src/model';
import {ConfigurationService} from './configuration.service';
import {Http} from '@angular/http';
import {Observable} from 'rxjs';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class RetrospectiveService {

  private _currentRetrospective: IBasicRetrospective<IRetrospectiveUser>;

  private static extractRetrospectiveIdFromLocation(location: string): string {
    if (location == null) {
      return null;
    }
    let id: string = location.substring((location.lastIndexOf('/') + 1), location.length);
    console.log('id for retrospective is: ' + id);
    return id;
  }

  constructor(private userService: UserService,
              private authService: AuthenticationService,
              private configuration: ConfigurationService,
              private authHttp: AuthHttp
  ) {
  }

  public joinRetrospective(retrospectiveId: string, shortName?: string): Observable<boolean> {
    return this.setupUser(shortName).flatMap(success => {
      if (success) {
        return this.authHttp.post(this.configuration.retrospectiveEndpoint + '/' + retrospectiveId + '/attendees', '').map(response => {
          if (response.status === 204) {
            return true;
          } else {
            console.log(`Couldn't joint retrospective "${retrospectiveId}"`);
            return false;
          }
        }, e => {
          console.log(e);
        });
      } else {
        console.log(`Couldn't create user "${shortName}"`);
        return <Observable<boolean>>Observable.create((observer) => {
          observer.next(false);
          observer.complete();
        });
      }
    });
  }

  public createRetrospective(sessionTitle: string, sessionDescription: string, shortName?: string): Observable<string> {
    let retrospective = <CreateRetrospectiveJSON>{};
    retrospective.description = sessionDescription;
    retrospective.name = sessionTitle;

    return this.setupUser(shortName).flatMap(success => {
      if (success) {
        return this.authHttp.post(this.configuration.retrospectiveEndpoint, retrospective).map(response => {
          return RetrospectiveService.extractRetrospectiveIdFromLocation(response.headers.get('Location'));
        }, e => {
          console.log(e);
        });
      } else {
        throw new Error('No user setup possible');
      }
    });
  }

  private setupUser(shortName?: string): Observable<boolean> {
    if (!this.authService.isUserLoggedIn()) {
      if (shortName == null) {
        throw new Error('No User Logged in an there is no shortName for create new User');
      }
      console.log('no User logged in register new user with shportname: ' + shortName);
      return this.userService.createUser(shortName);
    }
    return Observable.create((observer) => {
      observer.next(true);
      observer.complete();
    });
  }

  public getRetrospective(retrospectiveId: string): Observable<IBasicRetrospective<IRetrospectiveUser>> {
    if (this._currentRetrospective != null && this._currentRetrospective.uuid === retrospectiveId) {
      return Observable.create((observer) => {
        observer.next(this._currentRetrospective);
        observer.complete();
      });
    }
    return this.authHttp.get(this.configuration.retrospectiveEndpoint + '/' + retrospectiveId).map(response => {
      this._currentRetrospective = response.json();
      return this._currentRetrospective;
    });
  }

}
