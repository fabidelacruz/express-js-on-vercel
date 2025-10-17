import {Router} from 'express'
import {AuthenticatedRequest, authMiddleware} from "../middlewares/auth.js";
import usersService from "../user/service/service.js";

export const router = Router()
router.use(authMiddleware)

router.post('/notification/token', async (req: AuthenticatedRequest, res) => {
    await usersService.updateNotificationToken(req.userId, req.body.token)

    res.status(200).send()
})
