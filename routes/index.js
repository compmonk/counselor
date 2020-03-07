const session = require('express-session');
const MUUID = require('uuid-mongodb');

const articleRoutes = require("./article");
const userRoutes = require("./user");
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


    app.use("/api/articles", articleRoutes);
    app.use("/api/user", userRoutes);
};

module.exports = constructorMethod;