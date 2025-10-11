import {ConfigRepository} from "../repository/configRepository.js";

const getConfigValue = async (key: string, defaultValue?: string) => {
    const configDocument = await ConfigRepository.findOne({key})

    const config = configDocument?.toObject()

    return config?.value || defaultValue
}

export default {
    getConfigValue
}