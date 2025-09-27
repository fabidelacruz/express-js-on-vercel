import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            autoCreate: true
        });
    } catch (err) {
        process.exit(1);
    }
}
