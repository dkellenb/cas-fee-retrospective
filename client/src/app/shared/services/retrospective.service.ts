import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {AuthenticationService} from './authentication.service';
import {IBasicRetrospective, IUser} from '../../../../../shared/src/model';
import {ConfigurationService} from './configuration.service';
import {Http, Headers} from '@angular/http';
import {AuthHeader} from './auth-header';
import {Observable} from 'rxjs';
import InvalidArgumentError = webdriver.error.InvalidArgumentError;

@Injectable()
export class RetrospectiveService {

  private _currentRetrospective: IBasicRetrospective<IUser>;

  constructor(private userService: UserService,
              private authService: AuthenticationService,
              private configuration: ConfigurationService,
              private http: Http) {
  }


  public joinRetrospective(sessionKey: string, shortName?: string): string {
    return sessionKey;
  }


  public createRetrospective(sessionTitle: string, sessionDescription: string, shortName?: string): Observable<string> {
    let retrospective = <IBasicRetrospective<IUser>>{};
    retrospective.description = sessionDescription;
    retrospective.name = sessionTitle;

    return this.getJwtToken(shortName).flatMap(jwtToken => {
      return this.http.post(this.configuration.retrospectiveEndpoint, retrospective,
        {
          withCredentials: true,
          headers: AuthHeader.appendAuthHeader(new Headers(), jwtToken)
        }).map(response => {
        return RetrospectiveService.extractRetrospectiveIdFromLocation(response.headers.get('Location'));
      }, e => {
        console.log(e);
      });
    });
  }

  private getJwtToken(shortName?: string): Observable<string> {
    if (!this.authService.isUserLoggedIn()) {
      if (shortName == null) {
        throw new InvalidArgumentError('No User Logged in an there is no shortName for create new User');
      }
      console.log('no User logged in register new user with shportname: ' + shortName);
      return this.userService.createUser(shortName).map(isSuccess => {
        return this.authService.getAuthenticationToken();
      });
    }
    return Observable.create((observer) => {
      observer.next(this.authService.getAuthenticationToken());
      observer.complete();
    });
  }

  public getRetrospective(sessionKey: string): Observable<IBasicRetrospective<IUser>> {
    if (this._currentRetrospective != null && this._currentRetrospective.uuid === sessionKey) {
      return Observable.create((observer) => {
        observer.next(this._currentRetrospective);
        observer.complete();
      });
    }
    return this.getJwtToken().flatMap(jwtToken => {
      return this.http.get(this.configuration.retrospectiveEndpoint + '/' + sessionKey,
        {
          withCredentials: true,
          headers: AuthHeader.appendAuthHeader(new Headers(), jwtToken)
        }).map(response => {
        this._currentRetrospective = response.json();
        return this._currentRetrospective;
      })
    });
  }

  public get currentRetrospective(): IBasicRetrospective<IUser> {
    return this._currentRetrospective;
  }

  public static extractRetrospectiveIdFromLocation(location: string): string {
    if (location == null) {
      return null;
    }
    let id: string = location.substring((location.lastIndexOf('/') + 1), location.length);
    console.log('id for retrospective is: ' + id);
    return id;
  }

}
