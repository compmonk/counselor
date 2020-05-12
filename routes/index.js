const isLoggedIn = require("../core/login").isLoggedIn;

const session = require("express-session");
const MUUID = require("uuid-mongodb");
var mongoose = require("mongoose");
require("mongoose-uuid2")(mongoose);
var uuid = require("node-uuid");
require("mongoose-uuid2")(mongoose);
const uuidv5 = require("uuid/v5");
var UUID = mongoose.Types.UUID;

const articleRoutes = require("./article");
const userRoutes = require("./user");
const rootRoutes = require("./root");
const constructorMethod = (app) => {
  app.use(
    session({
      name: "AuthCookie",
      secret: "meetmetatthetogaparty",
      resave: false,
      saveUninitialized: true,
      genid: function (request) {
        // return MUUID.v4().toString()
        return new mongoose.Types.ObjectId();
      },
    })
  );
  app.use("/api/root", rootRoutes);
  app.use("/api/*", function (request, response, next) {
    if (isLoggedIn(request)) {
      next();
    } else {
      response.status(403);
      response.redirect("/");
    }
  });
  app.use("/api/articles", articleRoutes);
  app.use("/api/user", userRoutes);
};

module.exports = constructorMethod;
