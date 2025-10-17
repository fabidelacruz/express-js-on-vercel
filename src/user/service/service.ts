import {UserRepository} from "../repository/userRepository.js";
import {getUser} from '../../firebase/firebase.js'

const updateNotificationToken = async (userId: string, token: string) => {
    const options = {
        upsert: true,
    };
    await UserRepository.updateOne({uid: userId}, {notificationToken: token}, options)
}

const getAndRefreshUser = async (userId: string) => {
    const userRecord = await getUser(userId)

    if (userRecord !== null) {
        return UserRepository.findOneAndUpdate({
            uid: userId
        }, {
            name: userRecord.displayName,
            email: userRecord.email,
            photoUrl: userRecord.photoURL,
            lastActivity: new Date(),
        }, {upsert: true, new: true, setDefaultsOnInsert: true});
    } else {
        return getUserByUid(userId)
    }

}

const getUserByUid = async (uid: string) => {
    return UserRepository.findOne({uid})
}

export default {
    getAndRefreshUser,
    updateNotificationToken,
    getUserByUid,
}