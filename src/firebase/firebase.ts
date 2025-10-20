import pkg from "firebase-admin";
import {getAuth} from "firebase-admin/auth";
import {Message} from "firebase-admin/messaging";
import {MessageRequest, MessageResponse} from "./types.js";

const credential = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString()
);

const app = pkg.initializeApp({
    credential: pkg.credential.cert(credential),
});

export const getUser = async (uid: string) => {
    try {
        return getAuth(app).getUser(uid)
    } catch (e) {
        console.error(e)
        return null
    }
}

export const sendMessage = async (destination: string, request: MessageRequest): Promise<MessageResponse> => {
    try {
        const message: Message = {
            data: {
                ...request.data,
                title: request.title,
                body: request.body,
                type: request.type,
            },
            token: destination,
        }
        const messageId = await app.messaging().send(message)

        return {success: true, messageId}
    } catch (e) {
        return {success: false, error: e}
    }
}
