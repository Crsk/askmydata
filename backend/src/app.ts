import express, { Application } from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'

export class App {
  private app: Application = express()

  constructor() {
    dotenv.config()
    this._middlewares()
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
}