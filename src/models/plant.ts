import mongoose from "mongoose";

const taxonomy = new mongoose.Schema({
    class: {type: String, required: true, unique: false},
    genus: {type: String, required: false, unique: false},
    family: {type: String, required: false, unique: false},
    phylum: {type: String, required: false, unique: false},
    kingdom: {type: String, required: false, unique: false},
    synonyms: {type: [String], required: false, unique: false},
});

const watering = new mongoose.Schema({
    min: {type: Number, required: true, unique: false},
    max: {type: Number, required: true, unique: false},
});

const schema = new mongoose.Schema({
    name: {type: String, required: true, unique: false},
    userId: {type: String, required: true, unique: false},
    imageUrl: {type: String, required: false, unique: false},
    commonNames: {type: [String], required: false, unique: false},
    description: {type: String, required: false, unique: false},
    synonyms: {type: [String], required: false, unique: false},
    taxonomy: {type: taxonomy},
    watering: {type: watering},
});

export const Plant = mongoose.model("Plants", schema);
