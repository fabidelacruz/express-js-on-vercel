export interface PlantIdRequest {
    images: string[],
    latitude: number,
    longitude: number,
    similar_images: boolean,
}

export interface PlantIdResponse {
    access_token?: string,
    result?: PlantResultDTO,

}

export interface PlantResultDTO {
    classification?: PlantSuggestionsDTO,
    is_plant?: IsPlantDTO,
}

export interface PlantSuggestionsDTO {
    suggestions?: PlantSuggestionDTO[],
}

export interface IsPlantDTO{
    probability?: number,
    threshold?: number,
    binary?: boolean,
}

export interface PlantSuggestionDTO {
    id?: string,
    name?: string,
    probability?: number,
    similar_images?: PlantSimilarImageDTO[],
    details?: PlantDetailsDTO,
}

export interface PlantSimilarImageDTO {
    url?: string,
    similarity?: number,
}

export interface PlantDetailsDTO {
    common_names?: string[],
    taxonomy?: PlantTaxonomyDTO,
    url?: string,
    description?: PlantDescriptionDTO,
    synonyms?: string[],
    watering?: PlantWateringDTO
}

export interface PlantTaxonomyDTO {
    taxonomyClass?: string,
    genus?: string,
    order?: string,
    family?: string,
    phylum?: string,
    kingdom?: string
}

export interface PlantDescriptionDTO {
    value?: string,
    citation?: string
}

export interface PlantWateringDTO {
    min?: number,
    max?: number,
}
