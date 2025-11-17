import {DayOfWeek} from "../watering/model/wateringConfiguration.js";

const DAY_MAP: Record<DayOfWeek, number> = {
    "sunday": 0,
    "monday": 1,
    "tuesday": 2,
    "wednesday": 3,
    "thursday": 4,
    "friday": 5,
    "saturday": 6,
};

export function nextDateTime(days: DayOfWeek[], time: string): Date {
    if (days.length === 0) {
        throw new Error("Days array cannot be empty");
    }

    const now = new Date();
    const [hours, minutes] = time.split(":").map(Number);

    let closestDate: Date | null = null;

    for (const day of days) {
        const dayLower = day.toLowerCase();
        if (!(dayLower in DAY_MAP)) {
            throw new Error(`Invalid day: ${day}`);
        }

        const dayOfWeek = DAY_MAP[dayLower];

        const candidate = new Date(now);
        candidate.setHours(hours, minutes, 0, 0);

        const today = now.getDay();
        let diff = (dayOfWeek - today + 7) % 7;

        if (diff === 0 && candidate <= now) {
            diff = 7; // si es hoy pero la hora ya pasó
        }

        candidate.setDate(now.getDate() + diff);

        if (!closestDate || candidate < closestDate) {
            closestDate = candidate;
        }
    }

    return closestDate!;
}

export function dateAfterDays(daysFromNow: number, time: string): Date {
    if (daysFromNow < 0) {
        throw new Error("daysFromNow cannot be negative");
    }

    const now = new Date();
    const [hours, minutes] = time.split(":").map(Number);

    const result = new Date(now);
    result.setDate(now.getDate() + daysFromNow);
    result.setHours(hours, minutes, 0, 0);

    return result;
}
