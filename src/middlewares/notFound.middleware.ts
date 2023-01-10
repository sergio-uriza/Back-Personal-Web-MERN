import { Request, Response } from "express";

export const notFound = (req: Request, res: Response) => {
  return res.status(404).send({ error: "Not Found" });
}
