import { injectable } from 'inversify';
import { IUserJwt } from '../../../shared/src/model/user';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';

@injectable()
export class UserJwtService {

  /** temporary secret. this will be changed later on. */
  private static readonly JWT_KEY = 'V6LjnzR0mhQm2Ad81k8j';

  public static getJwtUser(request: Request): IUserJwt {
    let authorization = request.header('Authorization');
    if (authorization && authorization.indexOf('Bearer') >= 0) {
      let jwt = authorization.substring(7);
      try {
        let decoded = verify(jwt, UserJwtService.JWT_KEY);
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
