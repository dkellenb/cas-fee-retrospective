import * as mongoose from 'mongoose';
import { injectable } from 'inversify';

/**
 * Abstract implementation for all repositories.
 */
@injectable()
export class AbstractRepository<T extends mongoose.Document> {

  private _model: mongoose.Model<T>;

  protected setModel(schemaModel: mongoose.Model<T>) {
    this._model = schemaModel;
  }

  protected getModel(): mongoose.Model<T> {
    return this._model;
  }

  create(item: T, callback: (error: any, result: any) => void) {
    console.log('AbstractRepository#create');
    this._model.create(item, callback);
  }

  retrieve(callback: (error: any, result: any) => void) {
    console.log('AbstractRepository#retrieve');
    this._model.find({}, callback)
  }

  update(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
    console.log('AbstractRepository#update | ' + _id);
    this._model.update({_id: _id}, item, callback);
  }

  delete(_id: string, callback:(error: any, result: any) => void) {
    console.log('AbstractRepository#delete | ' + _id);
    this._model.remove({_id: AbstractRepository.toObjectId(_id)}, (err) => callback(err, null));
  }

  findById(_id: string, callback: (error: any, result: T) => void) {
    console.log('AbstractRepository#findById | ' + _id);
    this._model.findById( _id, callback);
  }

  private static toObjectId (_id: string) : mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(_id)
  }

}
