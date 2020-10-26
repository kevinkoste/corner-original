import mongoose from 'mongoose'

const inviteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export interface Invite {
  email: string
}

interface InviteDocument extends mongoose.Document, Invite {}

interface InviteModel extends mongoose.Model<InviteDocument> {}

export default mongoose.model<InviteDocument, InviteModel>(
  'Invite',
  inviteSchema
)
