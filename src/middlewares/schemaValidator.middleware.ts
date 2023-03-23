import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'

export const schemaValidator = (schema: AnyZodObject) => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const request = schema.parse({
      params: req.params,
      query: req.query,
      body: req.body
    })
    if (request.params !== undefined) req.params = request.params
    if (request.query !== undefined) req.query = request.query
    if (request.body !== undefined) req.body = request.body
    next()
    return
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).send(err.issues.map(issue => (
        { path: issue.path.join('.'), message: issue.message }
      )))
      return
    }
    res.status(500).send({ message: 'Internal Server Error' })
  }
}
