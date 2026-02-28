import { Request, Response, NextFunction } from "express";
import { ZodError} from "zod";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message
      }))
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format"
    });
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as any).code === 11000
  ) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value"
    });
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }

  if (err instanceof Error) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};