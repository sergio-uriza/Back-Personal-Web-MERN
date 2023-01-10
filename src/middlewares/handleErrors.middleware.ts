/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError.class";
import mongoose from 'mongoose';


export const handleErrors = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.status).send({ message: err.message });
    return;
  }
  if (err instanceof mongoose.Error) {
    res.status(400).send({ message: 'Some of the data in request is invalid' });
    return;
  }
  res.status(500).send({ message: "Internal Server Error" });
};
