import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'

export const healthRouter = Router()

healthRouter.get('/', (req: Request, res: Response) => {
  return res.status(HttpStatus.OK).send()
})
