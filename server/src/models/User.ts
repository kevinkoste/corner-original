import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    components: [],
    followers: [],
    following: [],
    invited: [],
  },
  { timestamps: true }
)

export interface User {
  userId: string
  username: string
  components: any[]
  followers: any[]
  following: any[]
  invited: any[]
}

interface UserDocument extends mongoose.Document, User {}

interface UserModel extends mongoose.Model<UserDocument> {}

export default mongoose.model<UserDocument, UserModel>('User', userSchema)
