import {Watering} from "../../plant/model/plant.js";


export interface WateringReminder {
    id: string;
    plantId: string;
    userId: string;
    plantName: string;
    plantImageUrl: string;
    date: Date;
    checked: boolean;
    watering?: Watering;
}