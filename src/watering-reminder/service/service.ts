import {WateringReminderRepository} from "../../watering-reminder/repository/wateringReminderRepository.js";
import {WateringReminderCreateDTO} from "../types.js";
import {WateringReminder} from "../../watering-reminder/model/wateringReminder.js";
import {PagedResponse} from "../../dto/types.js";
import plantService from '../../plant/service/service.js'

const list = async (userId: string, page: number = 1, limit: number = 20): Promise<PagedResponse<WateringReminder>> => {
    const filter: any = {
        userId: userId,
        checked: false,
    }

    const total = await WateringReminderRepository.countDocuments(filter)

    const reminders = await WateringReminderRepository.find(filter)
        .sort({date: 1})
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    // Transformar fechas a string
    const remindersWithStringDates = reminders.map(reminder => ({
        ...reminder,
        date: reminder.date.toISOString() // Formato ISO 8601
    }))

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        content: remindersWithStringDates as any,
    }
}

const checkReminder = async (userId: string, reminderId: string): Promise<number> => {
    const result = await WateringReminderRepository.updateOne(
        {_id: reminderId, userId: userId},
        {$set: {checked: true}}
    );

    return result.matchedCount;
}

const create = async (userId: string, request: WateringReminderCreateDTO): Promise<WateringReminder> => {
    if (!request.watering) {
        const plant = (await plantService.get(request.plantId, userId))
        if (plant) request.watering = plant.watering;
    }

    const reminder = await WateringReminderRepository.create({...request, userId})
    return reminder.toObject();
}

const get = async (userId: string, reminderId: string): Promise<WateringReminder | null> => {
    const reminder = await WateringReminderRepository.findOne({
        _id: reminderId,
        userId: userId
    })

    return reminder ? reminder.toObject() : null
}

const remove = async (userId: string, reminderId: string): Promise<void> => {
    await WateringReminderRepository.deleteOne({_id: reminderId, userId: userId})
}

const removeRemindersOfPlant = async (userId: string, plantId: string): Promise<void> => {
    await WateringReminderRepository.deleteMany({plantId: plantId, userId: userId})
}

const findByIds = async (ids: string[], userId: string): Promise<WateringReminder[]> => {
    return WateringReminderRepository.find({
        _id: {
            $in: ids
        },
        userId: userId
    }).lean();
}

export default {
    create,
    get,    
    list,
    remove,
    checkReminder,
    removeRemindersOfPlant,
    findByIds,
}