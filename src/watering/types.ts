import {WateringType} from "./model/wateringConfiguration.js";

export interface WateringConfigurationDTO extends WateringConfigurationCreateDTO {
    id: string;
}

export interface WateringConfigurationCreateDTO {
    plantId: string;
    time: string;
    details: WateringConfigurationDetailsDTO;
}

export interface WateringConfigurationDetailsDTO {
    type: WateringType;
}


export interface WateringScheduleDTO extends WateringConfigurationDetailsDTO {
    type: 'schedules';
    daysOfWeek: string[];
}

export interface WateringDatesDTO extends WateringConfigurationDetailsDTO {
    type: 'dates-frequency';
    datesInterval: number;
}