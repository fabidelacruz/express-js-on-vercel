import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: {type: String, required: true, unique: true},
    name: {type: String, required: false, unique: false},
    email: {type: String, required: false, unique: false},
    photoUrl: {type: String, required: false, unique: false},
    notificationToken: {type: String, required: false, unique: false},
    lastActivity: {type: Date, required: false, unique: false},
}, {
    timestamps: true,
});

export const UserRepository = mongoose.model("Users", schema as any);
