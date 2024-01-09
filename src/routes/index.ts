// path : /src/:params
import express, { Router } from 'express'
import { MonitRouter } from './monit/router'

export class V1Router {
  private router: Router

  constructor() {
    this.router = express.Router()
    this.routes()
  }

  private routes(): void {
    this.router.use('/monit', (new MonitRouter).initRouter())
  }

  public initRouter(): Router {
    return this.router
  }
}