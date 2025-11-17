import {WateringConfigurationRepository} from "../repository/wateringConfigurationRepository.js";
import {WateringConfiguration, WateringDates, WateringSchedule} from "../model/wateringConfiguration.js";
import {WateringConfigurationCreateDTO, WateringConfigurationDTO} from "../types.js";
import {PagedResponse} from "../../dto/types.js";
import plantService from '../../plant/service/service.js'
import wateringReminderService from '../../watering-reminder/service/service.js'
import {dateAfterDays, nextDateTime} from "../../utils/dates.js"

export interface SearchParams {
    userId: string,
}

async function createReminderByConfig(config: WateringConfiguration, userId: string) {
    const plant = (await plantService.get(config.plantId, userId))

    const nexReminderDate = nextReminderDate(config);
    nexReminderDate.setHours(nexReminderDate.getHours() + 3);

    const reminder = {
        plantId: config.plantId,
        plantName: plant.name,
        plantImageUrl: plant.images?.[0]?.url || '',
        date: nexReminderDate,
        checked: false,
        watering: plant.watering,
    };
    await wateringReminderService.create(userId, reminder)
}

const create = async (userId: string, request: WateringConfigurationCreateDTO): Promise<WateringConfiguration> => {
    const config = await WateringConfigurationRepository.create({...request, userId})
    const configObj = config.toObject();

    await createReminderByConfig(config, userId);

    return configObj
}

const list = async (params: SearchParams, page: number = 1, limit: number = 20): Promise<PagedResponse<WateringConfiguration>> => {
    const filter: any = {
        userId: params.userId,
    }

    const [total, configs] = await Promise.all([
        WateringConfigurationRepository.countDocuments(filter),
        WateringConfigurationRepository.find(filter)
            .sort({createdAt: -1})
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
    ])

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        content: configs,
    }
}

const deleteConfig = async (id: string, userId: string) => {
    const config = await WateringConfigurationRepository.findByIdAndDelete({_id: id, userId: userId})
    await wateringReminderService.removeRemindersOfPlant(userId, config.plantId)
}

const updateConfig = async (id: string, body: WateringConfigurationDTO, userId: string) => {
    await WateringConfigurationRepository.updateOne({_id: id, userId: userId}, {...body})
    const config = await WateringConfigurationRepository.findOne({_id: id, userId: userId})

    await wateringReminderService.removeRemindersOfPlant(userId, id)
    await createReminderByConfig(config, userId)
}
const deleteConfigOfPlant = async (userId: string, plantId: string)=> {
    await WateringConfigurationRepository.deleteMany({plantId: plantId, userId: userId})
    await wateringReminderService.removeRemindersOfPlant(userId, plantId)
}

const nextReminderDate = (config: WateringConfiguration) => {
    switch (config.details.type) {
        case 'schedules':
            return nextDateTime((config.details as WateringSchedule).daysOfWeek, config.time)
        case 'dates-frequency':
            return dateAfterDays((config.details as WateringDates).datesInterval, config.time)
    }
}

export default {
    create,
    list,
    deleteConfig,
    updateConfig,
    deleteConfigOfPlant,
}