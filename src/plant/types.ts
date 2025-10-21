export interface PlantIdentificationRequest {
    images: string[],
    latitude?: number,
    longitude?: number,
}

export interface PlantIdentificationResponse {
    plant_results: PlantBaseDTO[],
    is_plant: IsPlantDTO
}

export interface PlantBaseDTO {
    externalId: string,
    name:  string,
    probability?: number,
    images?: PlantImageDTO[],
    commonNames?: string[],
    description?: string,
    synonyms?: string[],
    taxonomy: TaxonomyDTO,
    watering?: WateringDTO,
    moreInfoUrl?: string,
    propagationMethods?: string[],
    bestLightCondition?: string,
    commonUses?: string,
    culturalSignificance?: string,
    toxicity?: string,
    bestWatering?: string
    favourite?: boolean
}

export interface PlantImageDTO {
    url: string,
}

export interface PlantCreateDTO extends PlantBaseDTO {}

export interface TaxonomyDTO {
    taxonomyClass?: string,
    genus?: string,
    family?: string,
    order?: string,
    phylum?: string,
    kingdom?: string
}

export interface WateringDTO {
    min?: number,
    max?: number,
}

export interface PlantResponseDTO extends PlantBaseDTO {
    id: string
}

export interface IsPlantDTO {
    probability?: number,
    threshold?: number,
    binary?: boolean
}


export interface WateringReminderBaseDTO {
    plantId: string,
    plantName: string,
    plantImageUrl: string,
    date: Date,
    checked: boolean
}

export interface WateringReminderCreateDTO extends WateringReminderBaseDTO {}

export interface WateringReminderResponseDTO extends WateringReminderBaseDTO {
    id: string
}
