import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Configuration Enviroment Variables
dotenv.config()
const dbPath: string = process.env.DB_CONNECTION_PATH ?? 'mongodb://localhost:27017/newdb'

// Create MongoDB Connection
export const connectDataBase: () => Promise<typeof mongoose> = async () => {
  mongoose.set('strictQuery', true)
  return await mongoose.connect(dbPath)
}
