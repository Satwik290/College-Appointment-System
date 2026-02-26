import { Request , Response, NextFunction } from "express";
import jwt, { JwtPayload } from  "jsonwebtoken";    

export const authmiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};