const firebaseService = require("../services/firebaseService")

async function createUser(user) {

    const firebaseResponse = await firebaseService.doCreateUserWithEmailAndPassword(user.email,
        user.password,
        `${user.firstName} ${user.lastName}`)

    user.firebaseId = firebaseResponse.user.uid
    user.createdAt = firebaseResponse.user.createdAt
    user.lastLoginAt = firebaseResponse.user.lastLoginAt

    return {
        user,
        session: {
            "refreshToken": firebaseResponse.user.refreshToken,
            "accessToken": firebaseResponse.user.accessToken,
            "expirationTime": firebaseResponse.user.expirationTime
        }
    }
}

async function signIn(user) {
    const firebaseResponse = await firebaseService.signInWithEmailAndPassword(user.email, user.password)
    return firebaseResponse
}

async function resetPassword(user) {
    const firebaseResponse = await firebaseService.resetPassword(user.emai)
    return firebaseResponse
}

async function changePassword(user, oldPassword, newPassword) {
    const firebaseResponse = await firebaseService.changePassword(user.email, oldPassword, newPassword)
    return firebaseResponse
}

module.exports = {
    createUser,
    signIn,
    resetPassword,
    changePassword
}