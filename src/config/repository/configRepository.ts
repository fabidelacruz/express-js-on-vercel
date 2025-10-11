import mongoose from "mongoose";
import {Config} from "../model/config.js";

const schema = new mongoose.Schema<Config>({
    name: {type: String, required: true, unique: true},
    value: {type: String, required: true, unique: false},
});

export const ConfigRepository = mongoose.model<Config>("Configs", schema);
