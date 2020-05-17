const sessionModel = require("./models/session");

async function addSession(
  sessionId,
  userId,
  refreshToken,
  accessToken,
  expirationTime
) {
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
      expirationTime,
    });

    // const result = session
    //   .save()
    //   .then((result) => {
    //     const res = getSession(result._id);
    //     return res;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return err.message;
    //   });
    // return result;
    const insertInfo = await session.save();
    return insertInfo._doc;
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

  try {
    const sessionInfo = await sessionModel.findById(sessionId);
    if (sessionInfo == null) {
      errors["message"] = `Session with ${sessionId} does not exist`;
      error.http_code = 400;
      error.message = JSON.stringify({ errors: errors });
      throw error;
    }
    return sessionInfo._doc;
  } catch (e) {
    throw e;
  }
}

async function endSession(sessionId) {
  const error = new Error();
  error.http_code = 200;
  const errors = {};
  if (sessionId === undefined || sessionId === null) {
    errors["id"] = "sessionId is not defined";
    error.http_code = 400;
  }

  try {
    if (await isSessionValid(sessionId)) {
      const value = {
        isActive: false,
        endTime: new Date(),
      };
      const change = await sessionModel.update(
        { _id: sessionId },
        { $set: value }
      );
      if (change.nModified == 0) {
        errors["message"] = `Cannot update Session with ID ${sessionId}`;
        error.http_code = 400;
        error.message = JSON.stringify({ errors: errors });
        throw error;
      }
      const result = await getSession(sessionId);
      return result;
    }
  } catch (e) {
    throw e;
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

    const sessionActive = await sessionModel.findById(sessionId);
    if (sessionActive == null) {
      errors["message"] = `Session with Id ${sessionId} does not exist`;
      error.http_code = 400;
      error.message = JSON.stringify({ errors: errors });
      throw error;
    }
    return sessionActive._doc.isActive;
  } catch (e) {
    throw e;
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
    const projection = {
      refreshToken: false,
      accessToken: false,
      userId: false,
      __v: false,
    };

    const result = await sessionModel.find({ userId: userId }, projection);
    if (result.length === 0) {
      errors["message"] = `Session with UserId ${userId} does not exist`;
      error.http_code = 400;
      error.message = JSON.stringify({ errors: errors });
      throw error;
    }
    var outcome = [];
    for (var i = 0; i < result.length; i++) {
      outcome[i] = result[i]._doc;
    }
    return outcome;
  } catch (e) {
    throw e;
  }
}

//Updated
module.exports = {
  addSession,
  endSession,
  isSessionValid,
  getSessionByUserId,
};
