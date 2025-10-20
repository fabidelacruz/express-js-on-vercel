import {NextFunction, Request, Response} from "express";
import userService from "../user/service/service.js";

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers['x-client-id'];
        if (!authHeader) {
            return res.status(401).send();
        }

        const userId = Array.isArray(authHeader) ? authHeader[0] : authHeader;

        const userRecord = await userService.getAndRefreshUser(userId);
        if (userRecord === null) {
            return res.status(401).send();
        }

        req.userId = userId;

        next();
    } catch (e) {
        return res.sendStatus(500)
    }
};