const firebase = require("../core/firebaseAuth");

async function createUserWithEmailAndPassword(email, password, displayName) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};
  try {
    let firebaseResponse = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    if (displayName) {
      await firebase
        .auth()
        .currentUser.updateProfile({ displayName: displayName });
    }
    return firebaseResponse;
  } catch (e) {
    errors[e.code] = e.message;
    error.http_code = 403;
    error.message = JSON.stringify({
      errors: errors,
    });
    throw error;
  }
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
  const error = new Error();
  error.http_code = 200;
  const errors = {};
  try {
    return await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (e) {
    // errors[e.code] = e.message;
    error.http_code = 403;
    error.message = e.message;
    throw error;
  }
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
  getCurrentUser,
};
