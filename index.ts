import mongoose from 'mongoose';
import app from './src/app';
import dotenv from 'dotenv';
 

// Configuration Enviroment Variables
dotenv.config();
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;

// Create MongoDB Connection
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://${user}:${password}@${host}/`, (err) => {
  if (err) throw new Error(`[Database Connection Error]: ${err}`);

  // Execute APP and listen request to PORT
  app.listen(app.get('port'), () => {
    console.log(`[SERVER ON]: Running in http://localhost:${app.get('port')}`);
  });
});
