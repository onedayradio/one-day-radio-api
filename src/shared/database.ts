import mongoose, { Mongoose } from 'mongoose'

import { getValue } from '../shared'
import { generalLogger } from './logs'

// Use native promises
mongoose.Promise = global.Promise
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)

const mongoUrl = getValue('mongodb_url')

export const initDBConnection = async (): Promise<Mongoose> => {
  generalLogger.info(`Connecting to mongo database on ${mongoUrl}`)
  return mongoose.connect(mongoUrl, {
    socketTimeoutMS: 10000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}
