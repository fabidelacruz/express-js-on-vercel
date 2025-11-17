import {WateringDTO} from "../plant/types.js";

export interface WateringReminderBaseDTO {
    plantId: string,
    plantName: string,
    plantImageUrl: string,
    date: Date,
    checked: boolean,
    watering?: WateringDTO,
}

export interface WateringReminderCreateDTO extends WateringReminderBaseDTO {}

export interface WateringReminderResponseDTO extends WateringReminderBaseDTO {
    id: string
}
