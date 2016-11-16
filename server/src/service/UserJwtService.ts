import { injectable, inject } from 'inversify';
import * as moment from 'moment';
import { Request } from 'express';
import { verify, sign } from 'jsonwebtoken';
import TYPES from '../constant/types';
import { UserJwtKeyProvider } from './UserJwtKeyProvider';
import { ErrorWithMessage } from '../../../shared/src/util/ErrorWithMessage';
import { IUserJwt } from './model/User';

@injectable()
export class UserJwtService {

  constructor(@inject(TYPES.UserJwtKeyProvider) private jwtKeyProvider: UserJwtKeyProvider) { }

  public getJwtUser(request: Request): IUserJwt {
    let authorization = request.header('Authorization');
    if (authorization && authorization.indexOf('Bearer') >= 0) {
      let jwt = authorization.substring(7);
      let decoded = null;
      try {
        decoded = <IUserJwt>verify(jwt, this.jwtKeyProvider.getKey());
        console.log('Decoded ' + JSON.stringify(decoded));
      } catch (err) {
        console.log('Invalid JWT: ' + jwt);
        throw new InvalidJwt('Passed JWT ' + jwt + ' is invalid');
      }

      if (decoded.validUntil < moment().unix()) {
        throw new OutdatedToken('Token ' + jwt + ' is not valid anymore. Last valid date: ' + moment(decoded.validUntil));
      }
      return decoded;
    }
    console.log('No JWT given');
    throw new MissingJwt('No JWT given');
  }

  public createJwt(user: IUserJwt): string {
    return sign(user, this.jwtKeyProvider.getKey());
  }

}

class InvalidJwt extends ErrorWithMessage {
  constructor(msg) {
    super(msg);
  }
}

class MissingJwt extends ErrorWithMessage {
  constructor(msg) {
    super(msg);
  }
}

class OutdatedToken extends ErrorWithMessage {
  constructor(msg) {
    super(msg);
  }
}
