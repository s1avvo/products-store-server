import { NextFunction, Request, Response } from "express";

export class ValidationErrors extends Error {}

export const handleError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);

  res.status(err instanceof ValidationErrors ? 400 : 500).json({
    message:
      err instanceof ValidationErrors
        ? err.message
        : "Try again later, please!",
  });
};
