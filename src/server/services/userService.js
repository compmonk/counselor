const firebaseService = require("../services/firebaseService");
const moment = require("moment");

async function createUser(user) {
  try {
    const firebaseResponse = await firebaseService.createUserWithEmailAndPassword(
      user.email,
      user.password,
      `${user.firstName} ${user.lastName}`
    );
    user.firebaseId = firebaseResponse.user.uid;
    user.createdAt = moment(firebaseResponse.user.metadata.creationTime);
    user.lastLoginAt = moment(firebaseResponse.user.metadata.lastSignInTime);

    return {
      user,
      session: {
        refreshToken: firebaseResponse.user.refreshToken,
        accessToken: firebaseResponse.user.toJSON()["stsTokenManager"]
          .accessToken,
        expirationTime: moment(
          firebaseResponse.user.toJSON()["stsTokenManager"].expirationTime
        ),
      },
    };
  } catch (e) {
    throw e;
  }
}

async function signIn(user) {
  const error = new Error();
  error.http_code = 200;
  try {
    const firebaseResponse = await firebaseService.signInWithEmailAndPassword(
      user.email,
      user.password
    );
    return {
      uid: firebaseResponse.user.uid,
      session: {
        refreshToken: firebaseResponse.user.refreshToken,
        accessToken: firebaseResponse.user.toJSON()["stsTokenManager"]
          .accessToken,
        expirationTime: moment(
          firebaseResponse.user.toJSON()["stsTokenManager"].expirationTime
        ),
      },
    };
  } catch (e) {
    throw e;
  }
}

async function resetPassword(user) {
  const firebaseResponse = await firebaseService.resetPassword(user.emai);
  return firebaseResponse;
}

async function changePassword(user, oldPassword, newPassword) {
  const firebaseResponse = await firebaseService.changePassword(
    user.email,
    oldPassword,
    newPassword
  );
  return firebaseResponse;
}

async function signOut(user) {
  const firebaseResponse = await firebaseService.signOut();
  return firebaseResponse;
}

module.exports = {
  createUser,
  signIn,
  signOut,
  resetPassword,
  changePassword,
};
