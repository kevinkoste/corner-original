import mongoose from 'mongoose'

const authSchema = new mongoose.Schema(
  {
    authId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

export interface Auth {
  authId: string
  userId: string
  email: string
  lastLogin: number
}

interface AuthDocument extends mongoose.Document, Auth {}

interface AuthModel extends mongoose.Model<AuthDocument> {}

export default mongoose.model<AuthDocument, AuthModel>('Auth', authSchema)
