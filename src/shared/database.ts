import mongoose, { Mongoose } from 'mongoose'

import { getValue } from '../shared'

// Use native promises
mongoose.Promise = global.Promise
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)

const mongoUrl = getValue('mongodb_url')

export const initDBConnection = async (): Promise<Mongoose> => {
  return mongoose.connect(mongoUrl, {
    socketTimeoutMS: 10000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}
