import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: { type: String, required: true, unique: false },
    user_id: { type: String, required: true, unique: false},
    image_url: { type: String, required: false, unique: false},
});

export const Plant = mongoose.model("Plants", schema);
