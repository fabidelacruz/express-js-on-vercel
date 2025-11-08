import {WateringConfigurationRepository} from "../repository/wateringConfigurationRepository.js";
import {WateringConfiguration} from "../model/wateringConfiguration.js";
import {WateringConfigurationCreateDTO, WateringConfigurationDTO} from "../types.js";
import {PagedResponse} from "../../dto/types.js";

export interface SearchParams {
    userId: string,
}

const create = async (userId: string, request: WateringConfigurationCreateDTO): Promise<WateringConfiguration> => {
    const config = await WateringConfigurationRepository.create({...request, userId})

    return config.toObject()
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
    await WateringConfigurationRepository.deleteOne({_id: id, userId: userId})
}

const updateConfig = async (id: string, body: WateringConfigurationDTO, userId: string) => {
    await WateringConfigurationRepository.updateOne({_id: id, userId: userId}, {...body})
}
const deleteConfigOfPlant = async (userId: string, plantId: string)=> {
    await WateringConfigurationRepository.deleteMany({plantId: plantId, userId: userId})
}

export default {
    create,
    list,
    deleteConfig,
    updateConfig,
    deleteConfigOfPlant,
}