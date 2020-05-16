const firebase = require("../core/firebaseAuth")

async function createUserWithEmailAndPassword(email, password, displayName) {
    let firebaseResponse = await firebase.auth().createUserWithEmailAndPassword(email, password);
    if (displayName) {
        await firebase.auth().currentUser.updateProfile({displayName: displayName});
    }
    return firebaseResponse
}

async function changePassword(email, oldPassword, newPassword) {
    let credential = firebase.auth.EmailAuthProvider.credential(
        email,
        oldPassword
    );
    await firebase.auth().currentUser.reauthenticateWithCredential(credential);
    await firebase.auth().currentUser.updatePassword(newPassword);
    return await signOut();
}

async function signInWithEmailAndPassword(email, password) {
    return await firebase.auth().signInWithEmailAndPassword(email, password);
}

async function resetPassword(email) {
    return await firebase.auth().sendPasswordResetEmail(email);
}

async function updatePassword(password) {
    return await firebase.auth().updatePassword(password);
}

async function signOut() {
    return await firebase.auth().signOut();
}

async function getCurrentUser() {
    return firebase.auth().currentUser;
}

module.exports = {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    resetPassword,
    updatePassword,
    signOut,
    changePassword,
    getCurrentUser
};
