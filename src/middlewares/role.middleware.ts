import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../modules/user/user.model.js';

export const roleMiddleware =
  (...allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied',
        });
      }
      return next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  };
