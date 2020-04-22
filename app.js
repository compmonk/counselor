const express = require("express");
const app = express();
app.use("/public", express.static(__dirname + "/public"));
const path = require("path");
const configRoutes = require("./routes");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configRoutes(app);
app.get("/", (request, response, next) => {
  response.sendFile(path.join(__dirname, "public", "html", "index.html"));
});
app.listen(3001, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3001");
});
