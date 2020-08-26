import cors from 'cors'

export default cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (process.env.ALLOWED_ORIGINS.indexOf(origin) === -1) {
      return callback(
        new Error("This server's CORS policy does not allow access from the specified origin."), false)
    }
    return callback(null, true)
  }
})