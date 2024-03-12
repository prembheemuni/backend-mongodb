import { NextFunction, Request, Response } from "express";
import { ControllerType } from "../types/types.js";

class ErrorHandler extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ErrorHandler;

export const TryCatch =
  (func: ControllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch((error) => next(error));
  };
