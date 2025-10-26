export type WateringType = 'schedules' | 'dates-frequency'

export interface WateringConfiguration {
    id: string;
    plantId: string;
    userId: string;
    time: string;
    details: WateringConfigurationDetails;
}

export interface WateringConfigurationDetails {
    type: WateringType;
}

export interface WateringSchedule extends WateringConfigurationDetails {
    type: 'schedules';
    daysOfWeek: string[];
}

export interface WateringDates extends WateringConfigurationDetails {
    type: 'dates-frequency';
    datesInterval: number;
}