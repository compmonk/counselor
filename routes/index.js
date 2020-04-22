const isLoggedIn = require("../core/login").isLoggedIn;

const session = require('express-session');
const MUUID = require('uuid-mongodb');

const articleRoutes = require("./article");
const userRoutes = require("./user");
const rootRoutes=require("./root")
const constructorMethod = app => {
    app.use(session({
        name: 'AuthCookie',
        secret: 'meetmetatthetogaparty',
        resave: false,
        saveUninitialized: true,
        genid: function (request) {
            return MUUID.v4().toString()
        }
    }));
    app.use("/api/root", rootRoutes);
    app.use("/api/*", function (request, response, next) {
        if (isLoggedIn(request)) {
            next()
        } else {
            response.status(403);
            response.redirect("/")
        }
    });
    app.use("/api/articles", articleRoutes);
    app.use("/api/user", userRoutes);
};

module.exports = constructorMethod;