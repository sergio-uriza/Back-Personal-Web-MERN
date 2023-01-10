import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod'

export const schemaValidator = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try { 
    schema.parse({
      params: req.params,
      query: req.query,
      body: req.body
    })
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).send(err.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message })))
    }
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}
