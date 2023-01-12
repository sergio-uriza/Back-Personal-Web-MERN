import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import router from './routes/router';
import { notFound } from './middlewares/notFound.middleware';
import { handleErrors } from './middlewares/handleErrors.middleware';
 

// Configuration Enviroment Variables
dotenv.config();
const port: string | number = process.env.PORT || 8000;

// Create Express APP
const app: Express = express();

// Settings
app.set('port', port)

// Define SERVER to use "/api" and use rooRouter
app.get('/', (req: Request, res: Response) => {
  res.redirect('/api');
})

// Configure Body Parse
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '20mb' }));

// Configure Header HTTP - Cors
app.use(cors());

// Configure static folder
app.use('/public', express.static('public'));

// Swagger config and route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(undefined, {
  swaggerOptions: {
    url: "/public/swagger.json",
    explorer: true
  }
}));

// Configure routings
app.use('/api', router);
app.use(notFound);
app.use(handleErrors);


export default app;
