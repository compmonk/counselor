const express = require("express");
const bodyParser = require("body-parser");
const MUUID = require("uuid-mongodb");

const { isLoggedIn } = require("../core/login");
const users = require("../data/users");
const sessions = require("../data/sessions");

const router = express.Router();
router.use(bodyParser.json());
// router.use(bodyParser.urlencoded());

router.post("/signup", async (request, response) => {
  try {
    // console.log("Printing request.body =>" + request.body);
    request.session.user = await users.addUser(request.body);
    // console.log(
    //   "printing request.session.user in routes => " + request.session.user
    // );
    request.session.userID = request.session.user._id;
    await sessions.addSession(request.sessionID, request.session.userID);
    // response.redirect(`/${request.session.user.username}/`);
    response.cookie("rememberme", "yes", { maxAge: 3600, httpOnly: false });
    response.send(request.session.user);
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

// login service
router.post("/login", async (request, response) => {
  try {
    if (isLoggedIn(request)) {
      // response.redirect(`/${request.session.user.username}/`);
      response.cookie("rememberme", "yes", { maxAge: 3600, httpOnly: false });
      response.send(request.session.user);
    }
    const user = await users.isAuthenticated(
      request.body["email"],
      request.body["password"]
    );
    if (user) {
      await sessions.addSession(request.sessionID, user._id);
      request.session.user = user;
      request.session.userID = MUUID.from(user._id).toString();
      // response.redirect(`/${user.username}/feed`);
      response.send(request.session.user);
    }
  } catch (e) {
    response.setHeader("content-type", "application/json");
    response.status(e.http_code).send(e.message);
  }
});

// logout web api
router.get("/logout", async function (request, response) {
  await sessions.endSession(request.sessionID);
  request.session.destroy(function (err) {
    return response.status(204).send();
  });
});
module.exports = router;
