import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import dotenv from 'dotenv'
import router from './routes/router'
import { notFound } from './middlewares/notFound.middleware'
import { handleErrors } from './middlewares/handleErrors.middleware'

// Configuration Enviroment Variables
dotenv.config()
const port: string | number = process.env.PORT ?? 8000
const origin: string = process.env.CORS_ORIGIN ?? '*'

// Create Express APP
const app: Express = express()

// Settings
app.set('port', port)

// Configure Header HTTP - Cors
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))
app.use(cors({
  origin,
  methods: 'GET,PUT,PATCH,POST,DELETE'
}))

// Configure HTTP request logger
app.use(morgan('tiny'))

// Configure Body Parse
app.use(express.urlencoded({ extended: true, limit: '30mb' }))
app.use(express.json({ limit: '10mb' }))

// Configure static folder
app.use('/public', express.static('public'))

// Swagger config and route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(undefined, {
  swaggerOptions: {
    url: '/public/swagger.json',
    explorer: true
  }
}))

// Define SERVER to use "/api" and use rooRouter
app.get('/', (_req: Request, res: Response): void => {
  res.redirect('/api')
})

// Configure routings
app.use('/api', router)
app.use(notFound)
app.use(handleErrors)

export default app
