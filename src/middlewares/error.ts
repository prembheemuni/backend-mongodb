import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utills/utils-class.js";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  return res.status(err.statusCode).json({
    success: true,
    message: err.message,
  });
};
