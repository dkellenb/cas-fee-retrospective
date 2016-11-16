import * as mongoose from 'mongoose';

export class UserDbSchema {

  static get schema() {
    return new mongoose.Schema({
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
