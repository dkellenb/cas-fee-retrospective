import * as Mongoose from 'mongoose';
import * as nconf from 'nconf';

export class DataAccess {

  static mongooseInstance: any;
  static mongooseConnection: Mongoose.Connection;

  static connect (): Mongoose.Connection {
    if (this.mongooseInstance) {
      return this.mongooseInstance;
    }

    this.mongooseConnection  = Mongoose.connection;
    this.mongooseConnection.once('open', () => {
      console.log('Connected to Mongo DB using ' + nconf.get('mongodbUrl'));
    });

    this.mongooseInstance = Mongoose.connect(nconf.get('mongodbUrl'));
    return this.mongooseInstance;
  }

  constructor () {
    DataAccess.connect();
  }

}
