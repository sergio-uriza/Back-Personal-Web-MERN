import mongoose from "mongoose";
import dotenv from "dotenv";

// Configuration Enviroment Variables
dotenv.config();
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;

// Create MongoDB Connection
export const connectDataBase = async () => {
  mongoose.set("strictQuery", true);
  return mongoose.connect(`mongodb+srv://${user}:${password}@${host}/`);
};
