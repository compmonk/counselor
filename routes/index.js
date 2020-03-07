const articleRoutes = require("./article");
const constructorMethod = app => {
    app.use("/api/articles", articleRoutes);
};
module.exports = constructorMethod;