import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from "express-validator";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array().map((error: ValidationError) => ({
        field: error.type === 'field' ? (error as any).path : error.type,
        message: error.msg
      }))
    });
  }
  
  next();
};

export default { validateRequest };
