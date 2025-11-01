import mongoose from "mongoose";
import {WateringReminder} from "../model/wateringReminder.js";

const wateringReminderSchema = new mongoose.Schema<WateringReminder>({
    plantId: {type: String, required: true, unique: false},
    userId: {type: String, required: true, unique: false},
    plantName: {type: String, required: true, unique: false},
    plantImageUrl: {type: String, required: true, unique: false},
    date: {type: Date, required: true, unique: false},
    checked: {type: Boolean, required: true, unique: false},
});


wateringReminderSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

wateringReminderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

wateringReminderSchema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

export const WateringReminderRepository = 
    mongoose.model<WateringReminder>("WateringReminders", wateringReminderSchema as any);
