export interface Taxonomy {
    class: string;
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

export interface Plant {
    id: string;
    name: string;
    userId: string;
    imageUrl?: string;
    commonNames?: string[];
    description?: string;
    synonyms?: string[];
    taxonomy?: Taxonomy;
    watering?: Watering;
    moreInfoUrl?: string;
}