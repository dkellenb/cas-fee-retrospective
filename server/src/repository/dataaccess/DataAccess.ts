import * as Mongoose from 'mongoose';
import * as nconf from 'nconf';

export class DataAccess {

  static mongooseInstance: any;
  static mongooseConnection: Mongoose.Connection;
  static dbConnectionUrl: string;

  static connect(): Mongoose.Connection {
    if (this.mongooseInstance) {
      return this.mongooseInstance;
    }

    this.dbConnectionUrl = process.env.MONGODB_URI || nconf.get('mongodbUrl');

    this.mongooseConnection  = Mongoose.connection;
    this.mongooseConnection.once('open', () => {
      console.log('Connected to Mongo DB using ' + this.dbConnectionUrl);
    });

    this.mongooseInstance = Mongoose.connect(this.dbConnectionUrl);
    return this.mongooseInstance;
  }

  constructor () {
    DataAccess.connect();
  }

}
