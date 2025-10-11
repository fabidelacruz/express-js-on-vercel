import {PlantRepository} from "../repository/plantRepository.js";
import {PlantCreateDTO, PlantIdentificationRequest, PlantIdentificationResponse} from "../types.js";
import {Plant} from "../model/plant.js";
import {PagedResponse} from "../../dto/types.js";
import configService from "../../config/service/configService.js";
import client from "../../plantid/client.js";
import {PlantIdRequest} from "../../plantid/types.js";
import {identificationMock} from "./mockResponses.js";

interface SearchParams {
    search?: string,
    createdAt?: Date,
    userId: string,
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

    const total = await PlantRepository.countDocuments(filter)


    const plants = await PlantRepository.find(filter)
        .sort({createdAt: -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        content: plants,
    }
}

const get = async (id: string, userId: string) => {
    const plant = await PlantRepository.findById(id)

    return plant.toObject()
}

const remove = async (userId: string, id: string) => {
    await PlantRepository.deleteOne({_id: id, userId: userId})
}

const identify = async (request: PlantIdentificationRequest): Promise<PlantIdentificationResponse[]> => {
    const useMock = Boolean(await configService.getConfigValue('plantid.mock', 'true'))

    if (useMock) {
        return identificationMock
    }

    const plantIdRequest: PlantIdRequest = {
        images: request.images,
        latitude: request.latitude || 0,
        longitude: request.longitude || 0,
        similar_images: true
    }

    const identificationResponse = await client.identify(plantIdRequest)

    return identificationResponse.result?.classification?.suggestions?.map(it => {
        return {
            name: it.name,
            imageUrl: it.similar_images?.[0]?.url || '',
            commonNames: it.details?.common_names,
            description: it.details?.description?.value || '',
            synonyms: it.details?.synonyms,
            taxonomy: it.details?.taxonomy && {
                class: it.details?.taxonomy?.class,
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
            probability: it.probability
        }
    }) || []
}

export default {
    create,
    get,
    identify,
    list,
    remove,
}