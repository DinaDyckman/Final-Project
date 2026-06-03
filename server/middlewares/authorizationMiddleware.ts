import { Request, Response, NextFunction } from "express";

export function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;

  if (user && user.role === "Admin") {
    next();
  } else {
    return res.status(403).json({ 
      error: "גישה חסומה: רק מנהל מערכת מורשה לשנות נתונים אלו." 
    });
  }
}