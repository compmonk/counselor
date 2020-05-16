const firebaseConfig = require("../../settings").firebaseConfig

const firebase = require('firebase');
module.exports = firebase.initializeApp(firebaseConfig);