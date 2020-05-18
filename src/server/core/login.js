const sessions = require("../data/sessions");

const isLoggedIn = function (request) {
    return !!(request && request.session && request.session.user && sessions.isSessionValid(request.sessionID));
};

module.exports = {
    isLoggedIn
};