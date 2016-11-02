import { DataAccess } from '../dataaccess';

export class UserDbSchema {

  static get schema () {
    return DataAccess.mongooseInstance.Schema({
      uuid: {
        type: String,
        required: true,
        index: true,
        unique: true
      },
      shortName: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      email: {
        type: String
      },
      systemRole: {
        type: String,
        required: true
      },
      tokens: {
        type: Array
      }
    });
  }

}
