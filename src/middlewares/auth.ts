import {NextFunction, Request, Response} from "express";

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['x-client-id'];
    if (!authHeader) {
        return res.status(401).send();
    }

    req.userId = Array.isArray(authHeader) ? authHeader[0] : authHeader;

    next();
};