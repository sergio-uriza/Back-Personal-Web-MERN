import { Request, Response } from 'express'

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).send({ error: 'Not Found' })
}
