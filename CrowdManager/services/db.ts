import mongoose from "mongoose"

const db = mongoose.connect(process.env.MONGO_DB_STRING)
export default db
