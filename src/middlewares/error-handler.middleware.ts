import * as express from "express";
import { CustomError } from "../utils/custom-error";

export const errorHandler = (
  err: Error | CustomError,
  req: express.Request,
  res: any,
  next: express.NextFunction
) => {
  const status = (err as CustomError).status || 500;
  const message = err.message || "Internal Server Error";

  res.statusCode = status;

  res.json({
    status,
    message,
  });
};
