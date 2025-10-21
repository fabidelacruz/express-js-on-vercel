export interface WateringReminder {
    id: string;
    plantId: string;
    userId: string;
    plantName: string;
    plantImageUrl: string;
    date: Date;
    checked: boolean;
}