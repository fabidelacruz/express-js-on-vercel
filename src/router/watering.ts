import {Router} from 'express'
import {AuthenticatedRequest, authMiddleware} from "../middlewares/auth.js";
import wateringConfigurationService from "../watering/service/wateringConfigurationService.js";

import {WateringConfigurationDTO} from "../watering/types.js";

export const router = Router()
router.use(authMiddleware)

router.post('/configurations', async (req: AuthenticatedRequest, res) => {
    await wateringConfigurationService.create(req.userId, req.body)

    res.status(201).send()
})

router.get('/configurations', async (req: AuthenticatedRequest, res) => {
    const page = (req.query.page && parseInt(req.query.page.toString())) || 1
    const limit = 20

    const result = await wateringConfigurationService.list({ userId: req.userId }, page, limit)

    res.json({
        ...result,
        content: result.content.map(it => it as WateringConfigurationDTO),
    });
})
