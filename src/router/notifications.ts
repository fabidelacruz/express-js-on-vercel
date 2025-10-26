import {Router} from 'express'
import {AuthenticatedRequest, authMiddleware} from "../middlewares/auth.js";
import {sendMessage} from "../firebase/firebase.js";
import usersService from "../user/service/service.js";
import plantService from "../plant/service/service.js";

export const router = Router()
router.use(authMiddleware)

router.post('/send', async (req: AuthenticatedRequest, res) => {
    const user = await usersService.getUserByUid(req.userId)
    const plant = await plantService.get(req.body.data.plantId, req.userId)

    if (!user || !user.notificationToken) {
        res.status(404).send()
    }

    const response = await sendMessage(user.notificationToken, {...req.body, data: {...req.body.data, plant: JSON.stringify(plant)}})

    res.status(200).json(response)
})
