import {Schema, model} from 'mongoose';
import {WateringType} from "../model/wateringConfiguration.js";

interface WateringConfiguration {
    id: string;
    plantId: string;
    userId: string;
    time: string;
    details: WateringConfigurationDetails;
}

interface WateringConfigurationDetails {
    type: WateringType;
    daysOfWeek?: string[];
    datesInterval?: number;
}

const WateringDetailsSchema = new Schema<WateringConfigurationDetails>({
    type: {
        type: String,
        enum: ['schedules', 'dates-frequency'],
        required: true,
    },
    daysOfWeek: {
        type: [String],
        required: function (this: WateringConfigurationDetails) {
            return this.type === 'schedules';
        },
    },
    datesInterval: {
        type: Number,
        required: function (this: WateringConfigurationDetails) {
            return this.type === 'dates-frequency';
        },
    },
}, {_id: false});

const schema = new Schema<WateringConfiguration>({
    plantId: {type: String, required: true},
    userId: {type: String, required: true},
    time: {type: String, required: true},
    details: {type: WateringDetailsSchema, required: true},
}, {
    timestamps: true
});

schema.virtual('id').get(function () {
    return this._id.toHexString();
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

schema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

export const WateringConfigurationRepository = model<WateringConfiguration>('WateringConfiguration', schema as any);
