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
    console.log('Calling /plants/list for userId:', req.userId);

    // --- Mocked Data ---
    // The real implementation is commented out below.
    const mockPlants = [
        {
            id: '60d21b4667d0d8992e610c85',
            name: 'Monstera Deliciosa',
            userId: req.userId, // Use the userId from the request
            externalId: 'ext-1',
            images: [{ url: 'https://example.com/monstera.jpg' }],
            commonNames: ['Swiss Cheese Plant'],
            description: 'A popular and easy-to-care-for houseplant.',
        },
        {
            id: '60d21b4667d0d8992e610c86',
            name: 'Ficus Lyrata',
            userId: req.userId,
            externalId: 'ext-2',
            images: [{ url: 'https://example.com/ficus.jpg' }],
            commonNames: ['Fiddle Leaf Fig'],
            description: 'A beautiful plant with large, violin-shaped leaves.',
        },
        {
            id: '60d21b4667d0d8992e610c87',
            name: 'Sansevieria Trifasciata',
            userId: req.userId,
            externalId: 'ext-3',
            images: [{ url: 'https://example.com/sansevieria.jpg' }],
            commonNames: ['Snake Plant', "Mother-in-Law's Tongue"],
            description: 'A very hardy plant that is difficult to kill.',
        },
    ];

    const page = (req.query.page && parseInt(req.query.page.toString())) || 1;

    res.json({
        page,
        limit: 20,
        total: mockPlants.length,
        totalPages: 1,
        content: mockPlants,
    });

    /*
    // --- Real Implementation ---
    // Uncomment this block when persistence is ready.
    const page = (req.query.page && parseInt(req.query.page.toString())) || 1
    const limit = 20
    const search = (req.query.q && req.query.q.toString()) || ''

    const result = await plantService.list({search, userId: req.userId}, page, limit)

    res.json({
        ...result,
        content: result.content.map(it => it as PlantResponseDTO),
    });
    */
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