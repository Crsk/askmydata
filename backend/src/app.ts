import express, { Application } from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import askRoutes from './routes/ask.routes'

export class App {
  private app: Application = express()

  constructor() {
    dotenv.config()
    this._middlewares()
    this._routes()
  }

  public async startServer(port: string = process.env.PORT || '3000') {
    await this.app.listen(port)
    console.log(`Server running on port ${port}`)
  }

  private _middlewares() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(morgan('dev'))
    this.app.use(cors())
  }

  private _routes() {
    this.app.use('/ask', askRoutes)
  }
}