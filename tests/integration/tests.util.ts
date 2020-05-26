import mongoose from 'mongoose'
import chai from 'chai'
import chaiSubset from 'chai-subset'
import Fixtures from 'node-mongodb-fixtures'

import { getValue } from '../../src/shared'

chai.use(chaiSubset)
mongoose.Promise = global.Promise
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)

const fixtures = new Fixtures({
  dir: 'tests/integration/db-fixtures',
  mute: true,
})

export const connectMongoose = (): Promise<void> => {
  const promise = async (resolve: any, reject: any): Promise<void> => {
    try {
      const alreadyConnected =
        mongoose.connection.db !== undefined && mongoose.connection.db !== null
      if (alreadyConnected) {
        resolve()
      } else {
        void mongoose.connect(getValue('mongodb_url'), {
          useNewUrlParser: true,
          useCreateIndex: true,
          user: getValue('mongodb_username'),
          pass: getValue('mongodb_password'),
        })
        mongoose.connection.once('open', () => {
          resolve()
        })
      }
    } catch (error) {
      reject(error)
    }
  }
  return new Promise(promise)
}

export const testsSetup = async (done: () => void): Promise<void> => {
  try {
    await connectMongoose()
    await fixtures.connect(getValue('mongodb_url'), {
      auth: {
        user: getValue('mongodb_username'),
        password: getValue('mongodb_password'),
      },
    })
    await fixtures.unload()
    await fixtures.load()
    await fixtures.disconnect()
    done()
  } catch (error) {
    console.log('errror', error)
  }
}
