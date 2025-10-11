export interface Taxonomy {
    taxonomyClass: string;
    genus?: string;
    family?: string;
    phylum?: string;
    kingdom?: string;
    synonyms?: string[];
}

export interface Watering {
    min: number;
    max: number;
}

export interface PlantImage {
    url: string,
}

export interface Plant {
    id: string;
    name: string;
    userId: string;
    externalId: string;
    images: PlantImage[];
    commonNames?: string[];
    description?: string;
    synonyms?: string[];
    taxonomy?: Taxonomy;
    watering?: Watering;
    moreInfoUrl?: string;
}