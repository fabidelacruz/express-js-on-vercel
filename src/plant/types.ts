export interface PlantBaseDTO {
    externalId: string,
    name:  string,
    images: PlantImageDTO[],
    commonNames?: string[],
    description?: string,
    synonyms?: string[],
    taxonomy: TaxonomyDTO,
    watering: WateringDTO,
    moreInfoUrl?: string,
}

export interface PlantImageDTO {
    url: string,
}

export interface PlantCreateDTO extends PlantBaseDTO {}

export interface TaxonomyDTO {
    taxonomyClass: string,
    genus?: string,
    family?: string,
    order?: string,
    phylum?: string,
    kingdom?: string,
    synonyms?: string[],
}

export interface WateringDTO {
    min: number,
    max: number,
}

export interface PlantResponseDTO extends PlantBaseDTO {
    id: string
}

export interface PlantIdentificationRequest {
    images: string[],
    latitude?: number,
    longitude?: number,
}

export interface PlantIdentificationResponse extends PlantBaseDTO {
    probability?: number,
}