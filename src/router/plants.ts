import {Router} from 'express'
import plantService from "../plant/service/service.js"
import {PlantIdentificationRequest, PlantResponseDTO} from "../plant/types.js";
import {AuthenticatedRequest, authMiddleware} from "../middlewares/auth.js";

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

    const result = await plantService.list({search, userId: req.userId}, page, limit)

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

router.get('/:id', async (req: AuthenticatedRequest, res) => {
    const plant = await plantService.get(req.userId, req.params.id)

    if (plant) {
        res.status(200).json(plant as PlantResponseDTO)
    } else {
        res.sendStatus(404)
    }
})

router.delete('/:id', async (req: AuthenticatedRequest, res) => {
    await plantService.remove(req.userId, req.params.id)

    res.sendStatus(200)
})

router.post('/identify', async (req: AuthenticatedRequest, res) => {
    const results = await plantService.identify(req.body as PlantIdentificationRequest)

    res.status(200).json(results)
})