import { DataAccess } from '../dataaccess';
import { Schema } from 'mongoose';

export class RetrospectiveDbSchema {

  static get schema() {
    return DataAccess.mongooseInstance.Schema({
      uuid: {
        type: String,
        required: true,
        index: true,
        unique: true
      },
      name: {
        type: String,
        required: true
      },
      description: {
        type: String
      },
      status: {
        type: String,
        required: true
      },
      attendees: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
      }],
      manager: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      comments: [{
        uuid: {
          type: String,
          required: true
        },
        title: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        author: {
          type: Schema.Types.ObjectId,
          ref: 'users'
        },
        anonymous: {
          type: Boolean,
          required: true
        },
        votes: [{
          uuid: {
            type: String,
            required: true
          },
          author: {
            type: Schema.Types.ObjectId,
            ref: 'users'
          },
          value: {
            type: Number,
            required: true
          }
        }]
      }]
    });
  }

}
