import { Request, Response } from 'express';
import { registerSchema , loginSchema } from './auth.validation.js';
import { registerUser , loginUser } from './auth.service.js';

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await registerUser(validatedData);
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed',
    });
  }
};

export const login = async (req: Request, res: Response) => {
    try {
        const validateUser = loginSchema.parse(req.body);
        const user = await loginUser(validateUser.email, validateUser.password);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Login failed'
        }); 
    }
};

export const logout = async (req: Request, res: Response) => {
    // For JWT, logout is handled on the client side by deleting the token.
    res.status(200).json({
        success: true,
        message: "Logged out successfully"      
    }); 
};