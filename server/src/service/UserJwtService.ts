import { injectable, inject } from 'inversify';
import { IUserJwt } from '../../../shared/src/model/UserDomainModel';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import TYPES from '../constant/types';
import {UserJwtKeyProvider} from './UserJwtKeyProvider';

@injectable()
export class UserJwtService {

  constructor(@inject(TYPES.UserJwtKeyProvider) private jwtKeyProvider: UserJwtKeyProvider) { }

  public getJwtUser(request: Request): IUserJwt {
    let authorization = request.header('Authorization');
    if (authorization && authorization.indexOf('Bearer') >= 0) {
      let jwt = authorization.substring(7);
      try {
        let decoded = verify(jwt, this.jwtKeyProvider.getKey());
        console.log('Decoded ' + decoded);
        return decoded;
      } catch (err) {
        console.log('Invalid JWT: ' + jwt);
        return null;
      }
    }
    console.log('No JWT given');
    return null;
  }

}
