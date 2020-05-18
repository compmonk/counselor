const isLoggedIn = require("../core/login").isLoggedIn;
const session = require("express-session");
var mongoose = require("mongoose");

const articleRoutes = require("./article");
const userRoutes = require("./user");
const rootRoutes = require("./root");
const constructorMethod = (app) => {
  app.use(
    session({
      name: "session",
      secret: "meetmetatthetogaparty",
      resave: false,
      saveUninitialized: true,
      genid: function (request) {
        return new mongoose.Types.ObjectId().toString();
      },
    })
  );
  app.use("/api/root", rootRoutes);
  app.use("/api/*", function (request, response, next) {
    if (isLoggedIn(request)) {
      next();
    } else {
      response.status(403).send();
    }
  });
  app.use("/api/articles", articleRoutes);
  app.use("/api/user", userRoutes);
};

module.exports = constructorMethod;
