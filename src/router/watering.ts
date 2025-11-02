import {Router} from 'express'
import {AuthenticatedRequest, authMiddleware} from "../middlewares/auth.js";
import wateringConfigurationService from "../watering/service/wateringConfigurationService.js";
import plantService from "../plant/service/service.js";

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

    const plants = await plantService.findByIds(result.content.map(it => it.plantId), req.userId)
    const plantsMap = new Map<string, any>()
    plants.forEach(it => plantsMap.set((it as any)._id.toHexString(), it))

    const dtoContent = result.content.map(it => {
        return {
            ...it,
            plantName: plantsMap.get(it.plantId.toString()).name
        } as WateringConfigurationDTO
    });

    res.json({
        ...result,
        content: dtoContent,
    });
})

router.delete('/configurations/:id', async (req: AuthenticatedRequest, res) => {
    await wateringConfigurationService.deleteConfig(req.params.id, req.userId)

    res.sendStatus(200)
})

router.put('/configurations/:id', async (req: AuthenticatedRequest, res) => {
    await wateringConfigurationService.updateConfig(req.params.id, req.body, req.userId)

    res.sendStatus(200)
})
