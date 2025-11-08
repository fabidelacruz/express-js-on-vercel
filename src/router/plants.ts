import {Router} from 'express'
import plantService from "../plant/service/service.js"
import {PlantIdentificationRequest, PlantResponseDTO, WateringReminderResponseDTO} from "../plant/types.js";
import {AuthenticatedRequest, authMiddleware} from "../middlewares/auth.js";
import wateringConfigurationService from "../watering/service/wateringConfigurationService.js";

export const router = Router()
router.use(authMiddleware)

router.post('/', async (req: AuthenticatedRequest, res) => {
    const plant = await plantService.create(req.userId, {...req.body})

    res.status(201).json(plant as PlantResponseDTO)
})

router.get('/list', async (req: AuthenticatedRequest, res) => {
    const page = (req.query.page && parseInt(req.query.page.toString())) || 1
    const limit = 20
    const search = (req.query.q && req.query.q.toString()) || ''
    const favourites = req.query.favourites === 'true' ? true : null

    const result = await plantService.list({search, userId: req.userId, favourites}, page, limit)

    res.json({
        ...result,
        content: result.content.map(it => it as PlantResponseDTO),
    });
})

router.get('/recent', async (req: AuthenticatedRequest, res) => {
    const page = (req.query.page && parseInt(req.query.page.toString())) || 1
    const limit = 20

    const filter = {
        createdAt: new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000)),
        userId: req.userId,
    }

    const result = await plantService.list(filter, page, limit)

    res.json({
        ...result,
        content: result.content.map(it => it as PlantResponseDTO),
    });
})

router.get('/catalog', async (req: AuthenticatedRequest, res) => {
    const list = await plantService.getCatalog(req.userId)

    res.status(200).json(list)
})

router.get('/:id', async (req: AuthenticatedRequest, res) => {
    const plant = await plantService.get(req.params.id, req.userId)

    if (plant) {
        res.status(200).json(plant as PlantResponseDTO)
    } else {
        res.sendStatus(404)
    }
})

router.delete('/:id', async (req: AuthenticatedRequest, res) => {
    await plantService.deleteWaterRemindersOfPlant(req.userId, req.params.id)
    await wateringConfigurationService.deleteConfigOfPlant(req.userId, req.params.id)
    await plantService.remove(req.userId, req.params.id)

    res.sendStatus(200)
})

router.post('/identify', async (req: AuthenticatedRequest, res) => {
    console.log("REQUEST: ", JSON.stringify(req.body, null, 2))

    const results = await plantService.identify(req.body as PlantIdentificationRequest)
    console.log("RESULTS: ", JSON.stringify(results, null, 2))

    res.status(200).json(results)
})


router.get('/watering-reminders/list', async (req: AuthenticatedRequest, res) => {
    const page = (req.query.page && parseInt(req.query.page.toString())) || 1
    const limit = 20

    const result = await plantService.wateringRemindersList(req.userId, page, limit)

    res.json({
        ...result,
        content: result.content.map(it => it as WateringReminderResponseDTO),
    });
})

router.post('/watering-reminders', async (req: AuthenticatedRequest, res) => {
    const reminder = await plantService.createWaterReminder(req.userId, {...req.body})
    res.status(201).json(reminder as WateringReminderResponseDTO)
})

router.patch('/watering-reminders/:id/check', async (req: AuthenticatedRequest, res) => {
    const success = await plantService.checkWaterReminder(req.userId, req.params.id);
    res.sendStatus(success > 0 ? 200 : 404);
})

router.get('/watering-reminders/:id', async (req: AuthenticatedRequest, res) => {
    const reminder = await plantService.getWaterReminder(req.userId, req.params.id)
    
    if (reminder) {
        res.status(200).json(reminder as WateringReminderResponseDTO)
    } else {
        res.sendStatus(404)
    }
})

router.delete('/watering-reminders/:id', async (req: AuthenticatedRequest, res) => {
    await plantService.deleteWaterReminder(req.userId, req.params.id)
    res.sendStatus(200)
})

router.patch('/:id/favourite', async (req: AuthenticatedRequest, res) => {
    const { favourite } = req.body;
    let success: number;
    
    if (favourite) {
        success = await plantService.setFavourite(req.userId, req.params.id);
    } else {
        success = await plantService.unSetFavourite(req.userId, req.params.id);
    }
    
    res.sendStatus(success > 0 ? 200 : 404);
})

