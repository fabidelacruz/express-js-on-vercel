export type WateringType = 'schedules' | 'dates-frequency'

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

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
    daysOfWeek: DayOfWeek[];
}

export interface WateringDates extends WateringConfigurationDetails {
    type: 'dates-frequency';
    datesInterval: number;
}