import {Router} from 'express'
import wateringReminderService from "../watering-reminder/service/service.js"
import {WateringReminderResponseDTO} from "../watering-reminder/types.js";
import {AuthenticatedRequest, authMiddleware} from "../middlewares/auth.js";

export const router = Router()
router.use(authMiddleware)


router.get('/list', async (req: AuthenticatedRequest, res) => {
    const page = (req.query.page && parseInt(req.query.page.toString())) || 1
    const limit = 20

    const result = await wateringReminderService.list(req.userId, page, limit)

    res.json({
        ...result,
        content: result.content.map(it => it as WateringReminderResponseDTO),
    });
})

router.post('/', async (req: AuthenticatedRequest, res) => {
    const reminder = await wateringReminderService.create(req.userId, {...req.body})
    res.status(201).json(reminder as WateringReminderResponseDTO)
})

router.patch('/:id/check', async (req: AuthenticatedRequest, res) => {
    const success = await wateringReminderService.checkReminder(req.userId, req.params.id);
    res.sendStatus(success > 0 ? 200 : 404);
})

router.get('/:id', async (req: AuthenticatedRequest, res) => {
    const reminder = await wateringReminderService.get(req.userId, req.params.id)
    
    if (reminder) {
        res.status(200).json(reminder as WateringReminderResponseDTO)
    } else {
        res.sendStatus(404)
    }
})

router.delete('/:id', async (req: AuthenticatedRequest, res) => {
    await wateringReminderService.remove(req.userId, req.params.id)
    res.sendStatus(200)
})


