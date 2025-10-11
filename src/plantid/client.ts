import axios from 'axios'
import {PlantIdRequest, PlantIdResponse} from "./types.js";

const client = axios.create({
    baseURL: process.env.PLANTID_API_URL,
    timeout: 30000,
})

client.interceptors.request.use(
    (config) => {
        const token = process.env.PLANTID_API_TOKEN;
        if (token) {
            config.headers['Api-Key'] = `${token}`;
        }
        return config;
    }
);

const identify = async (request: PlantIdRequest): Promise<PlantIdResponse> => {
    const response = await client.post('/identification', request, {
        params: {
            details: "common_names,scientific_name,synonyms,url,description,taxonomy,rank,watering",
            language: "es"
        }
    })

    return response.data
}

export default {
    identify,
}