import express, { Application } from 'express'
import * as dotenv from 'dotenv'

export class App {
  private app: Application = express()

  constructor() {
    dotenv.config()
  }

  public async startServer(port: string = process.env.PORT || '3000') {
    await this.app.listen(port)
    console.log(`Server running on port ${port}`)
  }
}
