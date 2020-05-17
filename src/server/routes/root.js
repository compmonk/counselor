const express = require("express");
const bodyParser = require("body-parser");

const {isLoggedIn} = require("../core/login");
const users = require("../data/users");
const sessions = require("../data/sessions");
const {getAllCurrencies} = require("../data/currency")
const userService = require("../services/userService")

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded());

router.post("/signup", async (request, response) => {
    try {
        let {user, session} = await userService.createUser(request.body)

        request.session.user = await users.addUser(user);

        request.session.userID = request.session.user._id;
        await sessions.addSession(request.sessionID,
            request.session.userID,
            session.refreshToken,
            session.accessToken,
            session.expirationTime);
        response.cookie("accessToken", session.accessToken, {
            expires: session.expirationTime.toDate(),
            httpOnly: false
        });
        response.cookie("refreshToken", session.refreshToken, {
            expires: session.expirationTime.toDate(),
            httpOnly: false
        });
        response.cookie("uid", request.session.user._id.toString(), {
            expires: session.expirationTime.toDate(),
            httpOnly: false
        })
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
            response.cookie("rememberme", "yes", {maxAge: 3600, httpOnly: false});
            response.send(request.session.user);
        }

        const {uid, session} = await userService.signIn(request.body);

        const user = await users.getUserByFirebaseId(uid)

        if (user) {
            request.session.user = user;
            request.session.userID = user._id;

            response.cookie("accessToken", session.accessToken, {
                expires: session.expirationTime.toDate(),
                httpOnly: false
            });
            response.cookie("refreshToken", session.refreshToken, {
                expires: session.expirationTime.toDate(),
                httpOnly: false
            });
            response.cookie("uid", request.session.user._id.toString(), {
                expires: session.expirationTime.toDate(),
                httpOnly: false
            })

            await sessions.addSession(request.sessionID,
                request.session.userID,
                session.refreshToken,
                session.accessToken,
                session.expirationTime);

            response.send(request.session.user);
        }
    } catch (e) {
        response.status(e.http_code).json({error: e.message});
    }
});

// logout web api
router.get("/logout", async function (request, response) {
    await sessions.endSession(request.sessionID);
    response.clearCookie("accessToken")
    response.clearCookie("refreshToken")
    response.clearCookie("uid")
    request.session.destroy(function (err) {
        return response.status(204).send(userService.signOut());
    });
});

router.get("/currency", async function (request, response) {
    try {
        const currencies = await getAllCurrencies()
        response.send(currencies)
    } catch (e) {
        response.status(500).json(e)
    }
})

module.exports = router;
