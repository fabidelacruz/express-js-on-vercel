import mongoose from "mongoose";
import {Plant, PlantImage, Taxonomy, Watering} from "../model/plant.js";

const taxonomySchema = new mongoose.Schema<Taxonomy>({
    taxonomyClass: {type: String, required: true, unique: false},
    genus: {type: String, required: false, unique: false},
    order: {type: String, required: false, unique: false},
    family: {type: String, required: false, unique: false},
    phylum: {type: String, required: false, unique: false},
    kingdom: {type: String, required: false, unique: false},
});

const wateringSchema = new mongoose.Schema<Watering>({
    min: {type: Number, required: true, unique: false},
    max: {type: Number, required: true, unique: false},
});

const plantImageSchema = new mongoose.Schema<PlantImage>({
    url: {type: String, required: true, unique: false},
});

const schema = new mongoose.Schema<Plant>({
    userId: {type: String, required: true, unique: false},
    externalId: {type: String, required: true, unique: false},
    name: {type: String, required: true, unique: false},
    images: {type: [plantImageSchema], required: false, unique: false},
    commonNames: {type: [String], required: false, unique: false},
    description: {type: String, required: false, unique: false},
    synonyms: {type: [String], required: false, unique: false},
    taxonomy: {type: taxonomySchema, required: false},
    watering: {type: wateringSchema, required: false},
    moreInfoUrl: {type: String, required: false, unique: false},
    propagationMethods: {type: [String], required: false, unique: false},
    bestLightCondition: {type: String, required: false, unique: false},
    commonUses: {type: String, required: false, unique: false},
    culturalSignificance: {type: String, required: false, unique: false},
    toxicity: {type: String, required: false, unique: false},
    bestWatering: {type: String, required: false, unique: false},
    favourite: {type: Boolean, required: false, default: false},
}, {
    timestamps: true,
});

schema.virtual('id').get(function() {
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

export const PlantRepository = mongoose.model<Plant>("Plants", schema as any);
