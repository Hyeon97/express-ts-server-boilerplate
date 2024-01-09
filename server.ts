
import express from "express"
import cors from 'cors'
import helmet from 'helmet'
import { config } from 'dotenv'
import compression from 'compression'
import dotenvExpand from 'dotenv-expand'
import cluster from 'cluster'
import os from 'os'
import { errorHandler } from './v1/middleware/errorHandler'
import { V1Router } from "./v1/routes"
import morganMiddleware from "./v1/middleware/morgan"


class Server {
  private app
  private payloadLimit: string
  constructor() {
    this.app = express()
    this.payloadLimit = '50mb'
    this.config()
    this.routes()
    this.errorHandler()
  }

  /**
   */
  config = () => {
    try {
      dotenvExpand.expand(config({ path: './.env' }))
      this.app
        .use(express.json({ type: ["application/json", "text/plain"], limit: this.payloadLimit }))
        .use(express.urlencoded({ extended: true }))
        .use(cors({ origin: "*", credentials: false }))
        .use(compression())
        .use(helmet())
        .use(morganMiddleware)
    } catch (error) { throw error }
  }

  routes() {
    try {
      this.app
        .use('/v1', (new V1Router).initRouter())
        .use('*', (req, res) => { res.send({ 'message': 'The URL does not exist' }) })
    } catch (error) { throw error }
  }

  errorHandler() {
    this.app.use(errorHandler)
  }

  start = async () => {
    const numCPUs = os.cpus().length
    if (cluster.isPrimary) {
      // console.log(`Master ${process.pid} is running`)

      // Fork workers.
      for (let i = 0; i < numCPUs; i++) { cluster.fork() }

      cluster.on('exit', (worker, code, signal) => {
        cluster.fork() // Create a new worker when one dies
      })

    } else {
      const port = process.env.PORT
      this.app.listen(port, () => { console.log(`Server is running on port ${port}`) })
    }
  }
}

const server = new Server()
server.start()