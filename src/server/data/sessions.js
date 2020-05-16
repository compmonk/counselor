const sessionModel = require("./models/session");

async function addSession(sessionId, userId, refreshToken, accessToken, expirationTime) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (sessionId === undefined || sessionId === null) {
        errors["sessionId"] = "sessionId is not defined";
        error.http_code = 400;
    }

    try {
        const session = new sessionModel({
            _id: sessionId,
            userId: userId,
            startTime: new Date(),
            isActive: true,
            refreshToken,
            accessToken,
            expirationTime
        });

        const result = session
            .save()
            .then((result) => {
                const res = getSession(result._id);
                return res;
            })
            .catch((err) => {
                console.log(err);
                return err.message;
            });
        return result;
    } catch (e) {
        throw e;
    }
}

async function getSession(sessionId) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (sessionId === undefined || sessionId === null) {
        errors["id"] = "sessionId is not defined";
        error.http_code = 400;
    }


    const result = sessionModel
        .findById(sessionId)

        .exec()
        .then((doc) => {
            if (doc == null) {
                return "ID does not exist";
            } else {
                console.log("Session found with ID: => " + sessionId);
                return doc;
            }
        })
        .catch((err) => {
            console.log(err);
            return err.message;
        });
    return result;
}

async function endSession(sessionId) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};
    if (sessionId === undefined || sessionId === null) {
        errors["id"] = "sessionId is not defined";
        error.http_code = 400;
    }

    if (await isSessionValid(sessionId)) {

        const value = {
            isActive: false,
        };
        const res = sessionModel
            .update({_id: sessionId}, {$set: value})
            .exec()
            .then((doc) => {
                return doc;
            })
            .catch((err) => {
                console.log(err);
                return err.message;
            });
        return res;
    }
}

async function isSessionValid(sessionId) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};
    try {
        if (sessionId === undefined || sessionId === null) {
            errors["id"] = "sessionId is not defined";
            error.http_code = 400;
        }
        const res = sessionModel
            .findById(sessionId)

            .exec()
            .then((doc) => {
                if (doc == null) {
                    return "ID does not exist";
                }
                return doc.isActive;
            })
            .catch((err) => {
                console.log(err);
                return err.message;
            });
        return res;
    } catch (e) {
        return false;
    }
}

async function getSessionByUserId(userId) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};
    try {

        if (userId === undefined || userId === null) {
            errors["id"] = "id is not defined";
            error.http_code = 400;
        }
        const res = sessionModel
            .findOne({userId: userId})

            .exec()
            .then((doc) => {
                if (doc == null) {
                    return "ID does not exist";
                }
                return doc;
            })
            .catch((err) => {
                console.log(err);
                return err.message;
            });
        return res;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    addSession,
    endSession,
    isSessionValid,
    getSessionByUserId,
};
