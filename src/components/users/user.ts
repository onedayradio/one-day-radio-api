import mongoose, { Model } from 'mongoose'
import { DBUser } from '../../types'

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, 'First name is required'],
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Email is required'],
      validate: [
        {
          validator: (email: string): boolean => {
            const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i
            return emailRegex.test(email)
          },
          msg: '{VALUE} is not a valid email',
        },
        {
          validator: async (email: string): Promise<boolean> => {
            const dbUser = await mongoose.models.User.findOne({ email })
            return dbUser ? false : true
          },
          msg: 'Email already in use',
        },
      ],
    },
  },
  {
    timestamps: true,
    collection: 'users',
  },
)

let userModel: Model<DBUser>
try {
  userModel = mongoose.model<DBUser>('User')
} catch (error) {
  userModel = mongoose.model<DBUser>('User', UserSchema)
}

export { userModel as UserModel }
