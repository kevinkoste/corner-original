import mongoose from 'mongoose'

const connectMongoDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

export default connectMongoDB
