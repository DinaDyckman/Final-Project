import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    
    // תיעוד השגיאה
    console.error(`[Error] ${req.method} ${req.path}`);
    console.error(err.stack || err);

    // חילוץ הסטטוס - בדיקה אם קיים status או statusCode
    const statusCode = err.status || err.statusCode || 500;

    // החזרת תשובה
    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || "Internal Server Error",
            // מציג פרטים רק אם אנחנו במצב פיתוח
            ...(process.env.NODE_ENV === 'development' && { details: err.stack })
        }
    });
};