import {PlantRepository} from "../repository/plantRepository.js";
import {WateringReminderRepository} from "../repository/wateringReminderRepository.js";
import {PlantCreateDTO, PlantIdentificationRequest, PlantIdentificationResponse} from "../types.js";
import {WateringReminderCreateDTO} from "../types.js";
import {Plant, PlantCatalog} from "../model/plant.js";
import {WateringReminder} from "../model/wateringReminder.js";
import {PagedResponse} from "../../dto/types.js";
import configService from "../../config/service/configService.js";
import client from "../../plantid/client.js";
import {PlantIdRequest} from "../../plantid/types.js";
import {identificationMock} from "./mockResponses.js";
import {WateringConfigurationRepository} from "../../watering/repository/wateringConfigurationRepository.js";

interface SearchParams {
    search?: string,
    createdAt?: Date,
    userId: string,
    favourites?: boolean,
}

const create = async (userId: string, request: PlantCreateDTO): Promise<Plant> => {
    const plant = await PlantRepository.create({...request, userId})

    return plant.toObject()
}

const list = async (params: SearchParams, page: number = 1, limit: number = 20): Promise<PagedResponse<Plant>> => {
    const filter: any = {
        userId: params.userId,
    }

    if (params.search) {
        filter.name = new RegExp(params.search, "i")
    }

    if (params.createdAt) {
        filter.createdAt = {
            $gte: params.createdAt
        }
    }

    if (params.favourites) {
        filter.favourite = params.favourites
    }

    const [total, plants] = await Promise.all([
        PlantRepository.countDocuments(filter),
        PlantRepository.find(filter)
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
        content: plants,
    }
}

const get = async (id: string, userId: string) => {
    const plant = await PlantRepository.findOne({
        _id: id,
        userId: userId
    })

    return plant ? plant.toObject() : null
}

const remove = async (userId: string, id: string) => {
    await PlantRepository.deleteOne({_id: id, userId: userId})
    await Promise.all([
        WateringReminderRepository.deleteMany({plantId: id, userId: userId}),
        WateringConfigurationRepository.deleteMany({plantId: id, userId: userId})
    ])
}

const identify = async (request: PlantIdentificationRequest): Promise<PlantIdentificationResponse> => {
    /*const useMock = Boolean(await configService.getConfigValue('plantid.mock', 'false'))
    if (useMock) {
        return identificationMock
    }*/

    const plantIdRequest: PlantIdRequest = {
        images: request.images,
        latitude: request.latitude || 0,
        longitude: request.longitude || 0,
        similar_images: true
    }

    const identificationResponse = await client.identify(plantIdRequest)

    const isPlant = identificationResponse.result?.is_plant || {
        probability: 0,
        threshold: 0.5,
        binary: false
    }

    const plantResults = identificationResponse.result?.classification?.suggestions?.map(it => {
        return {
            externalId: it.id,
            name: it.name,
            probability: it.probability,
            images: it.similar_images?.map(it => {
                return {
                    url: it.url
                }
            }) || [],
            commonNames: it.details?.common_names,
            description: it.details?.description?.value || '',
            synonyms: it.details?.synonyms || [],
            taxonomy: it.details?.taxonomy && {
                taxonomyClass: it.details?.taxonomy?.class,
                family: it.details?.taxonomy?.family,
                genus: it.details?.taxonomy?.genus,
                order: it.details?.taxonomy?.order,
                phylum: it.details?.taxonomy?.phylum,
                kingdom: it.details?.taxonomy?.kingdom,
            },
            watering: it.details?.watering && {
                min: it.details?.watering?.min,
                max: it.details?.watering?.max,
            },
            propagationMethods: it.details?.propagation_methods || [],
            bestLightCondition: it.details?.best_light_condition,
            commonUses: it.details?.common_uses,
            culturalSignificance: it.details?.cultural_significance,
            toxicity: it.details?.toxicity,
            bestWatering: it.details?.best_watering,
        }
    }) || []

    return {
        plant_results: plantResults,
        is_plant: isPlant
    }
}


// ********************* Plantas Favoritas y Recordatorios ****************************
const setFavourite = async (userId: string, plantId: string): Promise<number> => {
    const result = await PlantRepository.updateOne(
        {_id: plantId, userId: userId},
        {$set: {favourite: true}}
    );

    return result.matchedCount;
}

const unSetFavourite = async (userId: string, plantId: string): Promise<number> => {
    const result = await PlantRepository.updateOne(
        {_id: plantId, userId: userId},
        {$set: {favourite: false}}
    );

    return result.matchedCount;
}

const wateringRemindersList = async (userId: string, page: number = 1, limit: number = 20): Promise<PagedResponse<WateringReminder>> => {
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

const checkWaterReminder = async (userId: string, reminderId: string): Promise<number> => {
    const result = await WateringReminderRepository.updateOne(
        {_id: reminderId, userId: userId},
        {$set: {checked: true}}
    );

    return result.matchedCount;
}

const createWaterReminder = async (userId: string, request: WateringReminderCreateDTO): Promise<WateringReminder> => {
    const reminder = await WateringReminderRepository.create({...request, userId})
    return reminder.toObject();
}

const getWaterReminder = async (userId: string, reminderId: string): Promise<WateringReminder | null> => {
    const reminder = await WateringReminderRepository.findOne({
        _id: reminderId,
        userId: userId
    })

    return reminder ? reminder.toObject() : null
}

const deleteWaterReminder = async (userId: string, reminderId: string): Promise<void> => {
    await WateringReminderRepository.deleteOne({_id: reminderId, userId: userId})
}

const deleteWaterRemindersOfPlant = async (userId: string, plantId: string): Promise<void> => {
    await WateringReminderRepository.deleteMany({plantId: plantId, userId: userId})
}

const getCatalog = async (userId: string): Promise<PlantCatalog[]> => {
    return PlantRepository.find({userId: userId})
        .select({name: 1})
        .sort({name: 1})
        .lean()
}

const findByIds = async (ids: string[], userId: string): Promise<Plant[]> => {
    return PlantRepository.find({
        _id: {
            $in: ids
        },
        userId: userId
    }).lean();
}

export default {
    create,
    get,
    identify,
    list,
    remove,
    setFavourite,
    unSetFavourite,
    wateringRemindersList,
    getWaterReminder,
    checkWaterReminder,
    createWaterReminder,
    deleteWaterReminder,
    deleteWaterRemindersOfPlant,
    getCatalog,
    findByIds,
}