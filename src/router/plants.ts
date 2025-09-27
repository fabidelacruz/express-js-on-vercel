import {Router} from 'express'
import {Plant} from "../models/plant.js"

export const router = Router()

router.post('/', async (req, res) => {
    const plant = await Plant.create({...req.body})

    res.status(201).json(plant)
})

router.get('/list', async (req, res) => {
    const page = (req.query.page && parseInt(req.query.page.toString())) || 1
    const limit = 20
    const search = (req.query.q && req.query.q.toString()) || ''

    const filter = search ? {
        name: new RegExp(search, "i")
    } : {}

    const total = await Plant.countDocuments(filter)


    const plants = await Plant.find(filter)
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

    res.json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        content: plants,
    });
})

router.get('/:id', async (req, res) => {
    const plant = await Plant.findById(req.params.id)

    if (plant) {
        res.status(200).json(plant)
    } else {
        res.sendStatus(404)
    }
})

router.delete('/:id', async (req, res) => {
    await Plant.deleteOne({_id: req.params.id})

    res.sendStatus(200)
})