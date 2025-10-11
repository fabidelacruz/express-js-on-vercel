export interface PlantBaseDTO {
    name:  string,
    imageUrl: string,
    commonNames?: string[],
    description?: string,
    synonyms?: string[],
    taxonomy: TaxonomyDTO,
    watering: WateringDTO,
    moreInfoUrl?: string,
}

export interface PlantCreateDTO extends PlantBaseDTO {}

export interface TaxonomyDTO {
    class: string,
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