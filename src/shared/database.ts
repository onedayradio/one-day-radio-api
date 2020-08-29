import mongoose, { Mongoose } from 'mongoose'

import { getValue } from '../shared'
import { generalLogger } from './logs'

// Use native promises
mongoose.Promise = global.Promise
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)

const mongoUrl = getValue('mongodb_url')

export const connectToDatabase = (cachedDb: Mongoose): Promise<Mongoose> => {
  console.time('connectingToMongo')
  if (cachedDb) {
    generalLogger.info('=> using cached database instance...')
    console.timeEnd('connectingToMongo')
    return Promise.resolve(cachedDb)
  }
  return mongoose
    .connect(mongoUrl, {
      socketTimeoutMS: 10000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((db) => {
      console.timeEnd('connectingToMongo')
      return db
    })
}
